// xmls_to_proto
// 读取输入目录的每一个xmls文件，
// 生成对应代码，包括go和c#的proto文件, 以及c#的mgr文件，go的data文件
package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/tealeg/xlsx"
)

var (
	fileLastChange = make(map[string]time.Time) // 文件的最后修改时间
)

func main() {
	args := os.Args
	indir := ""
	outdir := ""
	destfile := ""

	for _, arg := range args {
		if strings.Contains(arg, "-i:") {
			indir = strings.Split(arg, ":")[1]
		} else if strings.Contains(arg, "-o:") {
			outdir = strings.Split(arg, ":")[1]
		} else if strings.Contains(arg, "-f:") {
			destfile = strings.Split(arg, ":")[1]
		}
	}

	if strings.Compare(indir, "") == 0 {
		panic("you should set a indir -i:")
	}

	files, err := walkDir(indir, ".xlsm", destfile)
	if err != nil {
		panic(err.Error())
	}

	walkFile(files, outdir)

}

func walkDir(dirPth, suffix, destfile string) (files []string, err error) {
	files = make([]string, 0)
	suffix = strings.ToUpper(suffix) //忽略后缀的大小写
	//遍历目录
	err = filepath.Walk(dirPth, func(filename string, fi os.FileInfo, err error) error {
		if fi.IsDir() { // 忽略目录
			return nil
		}
		//检测是否为目标文件
		if destfile != "" && !strings.Contains(fi.Name(), destfile) {
			return nil
		}
		if (strings.HasSuffix(strings.ToUpper(fi.Name()), suffix) && strings.EqualFold(fi.Name(), destfile+suffix)) ||
			(strings.HasSuffix(strings.ToUpper(destfile), suffix) && strings.EqualFold(fi.Name(), destfile)) ||
			(strings.HasSuffix(strings.ToUpper(fi.Name()), suffix) && destfile == "") {
			// 过滤临时文件
			if !strings.Contains(filename, "~") {
				files = append(files, filename)
				// 记录文件的最后修改时间
				fileLastChange[filename] = fi.ModTime().UTC()
			}
		}
		return nil
	})
	return files, err
}

func walkFile(xlsxFileNames []string, outdir string) {
	for _, fileName := range xlsxFileNames {
		xlsxFile, err := xlsx.OpenFile(fileName)
		if err != nil {
			panic("读取 xlsx 文件错误\n" + err.Error())
		}
		// 去除空格 ，逗号转换
		xlsxFormat(xlsxFile)

		parseProto(xlsxFile)
		parseGodata(xlsxFile, fileLastChange[fileName])
		parseMgrCS(xlsxFile)
	}
	saveProto(outdir)
	saveGodata(outdir)
	saveMgrCS(outdir)
}

// sheet 表 转到 proto
var (
	protoStr = "syntax = \"proto3\";\n" +
		"package Config;\n" +
		"option csharp_namespace = \"Config\";\n" +
		"option go_package = \"config\"\n;"
	pnr = 0 // 变量名所在行数
	ptr = 1 // 变量类型所在行数
	pdr = 2 // 变量描述（注释）所在行数

	typeParse = map[string]string{
		"int32":         "int32  ",
		"int":           "int32  ",
		"int64":         "int64  ",
		"long":          "int64  ",
		"uint32":        "uint32 ",
		"uint":          "uint32 ",
		"uint64":        "uint64 ",
		"ulong":         "uint64 ",
		"string":        "string ",
		"float":         "float  ",
		"float32":       "float  ",
		"double":        "double ",
		"float64":       "double ",
		"bool":          "bool   ",
		"list<int32>":   "repeated int32  ",
		"list<int>":     "repeated int32  ",
		"list<int64>":   "repeated int64  ",
		"list<long>":    "repeated int64  ",
		"list<uint32>":  "repeated uint32 ",
		"list<uint>":    "repeated uint32 ",
		"list<uint64>":  "repeated uint64 ",
		"list<ulong>":   "repeated uint64 ",
		"list<string>":  "repeated string ",
		"list<float>":   "repeated float  ",
		"list<float32>": "repeated float  ",
		"list<double>":  "repeated double ",
		"list<float64>": "repeated double ",
		"list<bool>":    "repeated bool   ",
	}
	typeCheck = map[string]func(string) error{
		"int32":         checkInt,
		"int":           checkInt,
		"int64":         checkInt,
		"long":          checkInt,
		"uint32":        checkUint,
		"uint":          checkUint,
		"uint64":        checkUint,
		"ulong":         checkUint,
		"string":        checkString,
		"float":         checkFloat,
		"float32":       checkFloat,
		"double":        checkFloat,
		"float64":       checkFloat,
		"bool":          checkBool,
		"list<int32>":   checkListInt,
		"list<int>":     checkListInt,
		"list<int64>":   checkListInt,
		"list<long>":    checkListInt,
		"list<uint32>":  checkListUint,
		"list<uint>":    checkListUint,
		"list<uint64>":  checkListUint,
		"list<ulong>":   checkListUint,
		"list<string>":  checkListString,
		"list<float>":   checkListFloat,
		"list<float32>": checkListFloat,
		"list<double>":  checkListFloat,
		"list<float64>": checkListFloat,
		"list<bool>":    checkListBool,
	}
	maxlentype = "repeated uint64 "
)

// 生成 proto文件
func parseProto(xlsxFile *xlsx.File) {
	for _, sheet := range xlsxFile.Sheets {
		if strings.Contains(sheet.Name, "Sheet") {
			continue
		}
		protoStr += "\nmessage " + sheet.Name + "\n" +
			"{\n" +
			"\tmessage Record\n" +
			"\t{\n"

		// 变量名的最大长度
		maxpnlen := 0
		for i := 0; i < len(sheet.Rows[pnr].Cells); i++ {
			pn := sheet.Rows[pnr].Cells[i].Value
			if len(pn) > maxpnlen {
				maxpnlen = len(pn)
			}
		}

		for i := 0; i < len(sheet.Rows[pnr].Cells); i++ {
			pn := sheet.Rows[pnr].Cells[i].Value // 变量名
			pt := sheet.Rows[ptr].Cells[i].Value // 变量类型
			pd := sheet.Rows[pdr].Cells[i].Value // 变量描述(注释)

			if pn == "" {
				fmt.Println(sheet.Name+"第", i, "列变量名为空，其后数据已忽略")
				break
			}

			if v, ok := typeParse[pt]; ok {
				line := "\t\t" + v
				ll := len("\t\t" + maxlentype)
				line += pn
				for len(line) < maxpnlen+ll {
					line += " "
				}
				idx := fmt.Sprint(i + 1)
				if i+1 < 10 {
					idx += " "
				}
				line += " = " + idx + ";"
				line += "\t\t// " + pd + "\n"
				protoStr += line
			} else {
				panic(sheet.Name + " " + fmt.Sprint(ptr) + " 行 " + fmt.Sprint(i) + " 列，变量类型：" + pt + " 不支持")
			}
		}
		protoStr += "\t}\n" +
			"\trepeated Record records = 1;\n" +
			"\tint64 version           = 2;\n" +
			"}\n"
	}
}

// 保存 proto 文件
func saveProto(outdir string) {
	bmsg := []byte(protoStr)
	if err := ioutil.WriteFile(outdir+"config.proto", bmsg, os.ModePerm); err != nil {
		panic(err.Error())
	}
}

//---------------------------------------------------------------------------------------------
var (
	configInit = "package config\n\n" +
		"import (\n" +
		"\t\"github.com/golang/protobuf/proto\"\n" +
		")\n" +
		"var (\n" +
		"\tTableVersions = make(map[string]int64)\n" +
		"\tTableMap = make(map[string][]byte)\n" +
		"__tables__\n" +
		")\n\n" +
		"func init(){\n" +
		"__init__\n" +
		"}\n\n" +
		"__funcs__\n"

	configLoad = "package config\n\n" +
		"import (\n" +
		"\t\"github.com/golang/protobuf/proto\"\n" +
		"\t\"io/ioutil\"\n" +
		"\t\"os\"\n" +
		"\t\"xxtea\"\n" +
		")\n" +
		"var (\n" +
		"\tTableVersions = make(map[string]int64)\n" +
		"\tTableMap = make(map[string][]byte)\n" +
		"__tables__\n" +
		")\n\n" +
		"func init(){\n" +
		"\tInit()\n" +
		"}\n\n" +
		"func Reload(){\n" +
		"\tTableVersions = make(map[string]int64)\n" +
		"\tTableMap = make(map[string][]byte)\n" +
		"__tables__\n" +
		"\tInit()\n" +
		"}\n\n" +
		"func Init(){\n" +
		"\tvar f *os.File\n" +
		"\tvar buf []byte\n" +
		"\tvar err error\n" +
		"\tkey := []byte(\"Kp/QG.V|!j7A=utb\")\n" +
		"__init__\n" +
		"}\n\n" +
		"__funcs__\n" +
		"__reload__\n" +
		"func ReloadTable(table_name string) {\n" +
		"\tswitch table_name {\n" +
		"__case__\n" +
		"\t}\n" +
		"}\n\n"

	valueParse = map[string]string{
		"string":        "\"value\"",
		"list<int32>":   "[]int32{values}",
		"list<int>":     "[]int32{values}",
		"list<int64>":   "[]int64{values}",
		"list<long>":    "[]int64{values}",
		"list<uint32>":  "[]uint32{values}",
		"list<uint>":    "[]uint32{values}",
		"list<uint64>":  "[]uint64{values}",
		"list<ulong>":   "[]uint64{values}",
		"list<string>":  "[]string{\"values\"}",
		"list<float>":   "[]float32{values}",
		"list<float32>": "[]float32{values}",
		"list<double>":  "[]float64{values}",
		"list<float64>": "[]float64{values}",
		"list<bool>":    "[]bool{values}",
	}
)

// 创建 go 数据
func parseGodata(xlsxFile *xlsx.File, lastChange time.Time) {
	for _, sheet := range xlsxFile.Sheets {
		if strings.Contains(sheet.Name, "Sheet") {
			continue
		}
		fpn := removeSpace(sheet.Rows[pnr].Cells[0].Value) // 首列变量名
		fpt := sheet.Rows[ptr].Cells[0].Value              // 首列变量类型
		tsn := titleName(sheet.Name)                       // Title sheet name

		citb := "\t" + tsn + "Ins = &" + tsn + "{}\n"
		citb += "\tMap_" + sheet.Name + " = make(map[" + fpt + "]*" + tsn + "_Record)\n"

		ciit := "\t//--------------------------------------------------------------------\n"
		ciit += "\t" + tsn + "Records := make([]*" + tsn + "_Record,0)\n\n"
		for i := 3; i < len(sheet.Rows); i++ {
			if sheet.Rows[i].Cells == nil || sheet.Rows[i].Cells[0] == nil {
				break
			}
			rdvn := sheet.Name + "_r" + fmt.Sprint(i) // record 变量名
			ciit += "\t" + rdvn + " :=" + tsn + "_Record{}\n"
			for j := 0; j < len(sheet.Rows[i].Cells); j++ {
				pn := sheet.Rows[pnr].Cells[j].Value // 变量名
				pt := sheet.Rows[ptr].Cells[j].Value // 变量类型
				ciit += "\t" + rdvn + "." + titleName(pn) + " = " + value2string(pt, sheet.Rows[i].Cells[j].Value) + "\n"

				if typeCheck[pt](sheet.Rows[i].Cells[j].Value) != nil {
					panic("表：" + sheet.Name + " " + fmt.Sprint(i+1) + " 行 " + fmt.Sprint(j) + " 列，（" + sheet.Rows[i].Cells[j].Value + "）无法转换为:" + pt)
				}
			}
			ciit += "\t" + tsn + "Records = append(" + tsn + "Records,&" + rdvn + ")\n"
			if fpt == "string" {
				ciit += "\tMap_" + sheet.Name + "[\"" + sheet.Rows[i].Cells[0].Value + "\"] = &" + rdvn + "\n\n"
			} else {
				ciit += "\tMap_" + sheet.Name + "[" + sheet.Rows[i].Cells[0].Value + "] = &" + rdvn + "\n\n"
			}
		}

		ciit += "\t" + tsn + "Ins.Records = " + tsn + "Records\n"
		ciit += "\t" + tsn + "Ins.Version = " + fmt.Sprint(lastChange.Format("20060102150405")) + "\n"
		ciit += "\tTableVersions[\"" + sheet.Name + "\"] = " + fmt.Sprint(lastChange.Format("20060102150405")) + "\n\n"

		ciit += "\tif data, err := proto.Marshal(" + tsn + "Ins); err != nil {\n" +
			"\t\tpanic(err.Error())\n" +
			"\t} else {\n" +
			"\t\tTableMap[\"" + sheet.Name + "\"] = data\n" +
			"\t}\n\n"

		ciit1 := "\t//--------------------------------------------------------------------\n"
		ciit1 += "\tf, err = os.Open(\"data/" + sheet.Name + ".bytes\")\n"
		ciit1 += "\tif err != nil {\n" + "\t\tpanic(err.Error())\n" + "\t}\n"
		ciit1 += "\tbuf, err = ioutil.ReadAll(f)\n"
		ciit1 += "\tif err != nil {\n" + "\t\tpanic(err.Error())\n" + "\t}\n"
		ciit1 += "\tbuf = xxtea.Decrypt(buf, key)\n"
		ciit1 += "\terr = proto.Unmarshal(buf, " + tsn + "Ins)\n"
		ciit1 += "\tif err != nil {\n" + "\t\tpanic(err.Error())\n" + "\t}\n"
		ciit1 += "\tfor i := 0; i < len(" + tsn + "Ins.Records); i++ {\n" +
			"\t\trecord := " + tsn + "Ins.Records[i]\n" +
			"\t\tMap_" + sheet.Name + "[record.Id] = record\n" +
			"\t}\n"
		ciit1 += "\tTableVersions[\"" + sheet.Name + "\"] = " + tsn + "Ins.Version\n"
		ciit1 += "\tTableMap[\"" + sheet.Name + "\"] = buf\n"

		cif := "func (this *" + tsn + ") GetRecordBy" + titleName(fpn) + "(" + fpn + " " + fpt + ") *" + tsn + "_Record {\n" +
			"\treturn Map_" + sheet.Name + "[" + fpn + "]\n" +
			"}\n"

		cir := "func ReloadTable" + tsn + "() {\n"
		cir += "\tvar f *os.File\n" +
			"\tvar buf []byte\n" +
			"\tvar err error\n" +
			"\tkey := []byte(\"Kp/QG.V|!j7A=utb\")\n"
		cir += "\tf, err = os.Open(\"data/" + sheet.Name + ".bytes\")\n"
		cir += "\tif err != nil {\n" + "\t\tpanic(err.Error())\n" + "\t}\n"
		cir += "\tbuf, err = ioutil.ReadAll(f)\n"
		cir += "\tif err != nil {\n" + "\t\tpanic(err.Error())\n" + "\t}\n"
		cir += "\tbuf = xxtea.Decrypt(buf, key)\n"
		cir += "\terr = proto.Unmarshal(buf, " + tsn + "Ins)\n"
		cir += "\tif err != nil {\n" + "\t\tpanic(err.Error())\n" + "\t}\n"
		cir += "\tfor i := 0; i < len(" + tsn + "Ins.Records); i++ {\n" +
			"\t\trecord := " + tsn + "Ins.Records[i]\n" +
			"\t\tMap_" + sheet.Name + "[record.Id] = record\n" +
			"\t}\n"
		cir += "\tTableVersions[\"" + sheet.Name + "\"] = " + tsn + "Ins.Version\n"
		cir += "\tTableMap[\"" + sheet.Name + "\"] = buf\n"
		cir += "}\n"

		cic := "\tcase " + "\"" + sheet.Name + "\":\n"
		cic += "\t\tReloadTable" + tsn + "()\n"

		configInit = strings.Replace(configInit, "__tables__", citb+"__tables__", -1)
		configInit = strings.Replace(configInit, "__init__", ciit+"__init__", -1)
		configInit = strings.Replace(configInit, "__funcs__", cif+"__funcs__", -1)

		configLoad = strings.Replace(configLoad, "__tables__", citb+"__tables__", -1)
		configLoad = strings.Replace(configLoad, "__init__", ciit1+"__init__", -1)
		configLoad = strings.Replace(configLoad, "__funcs__", cif+"__funcs__", -1)
		configLoad = strings.Replace(configLoad, "__reload__", cir+"__reload__", -1)
		configLoad = strings.Replace(configLoad, "__case__", cic+"__case__", -1)
	}
}

// 保存 go 数据
func saveGodata(outdir string) {
	configInit = strings.Replace(configInit, "__tables__\n", "", -1)
	configInit = strings.Replace(configInit, "__init__\n", "", -1)
	configInit = strings.Replace(configInit, "__funcs__\n", "", -1)
	bmsg := []byte(configInit)
	if err := ioutil.WriteFile(outdir+"config_init.go", bmsg, os.ModePerm); err != nil {
		panic(err.Error())
	}

	configLoad = strings.Replace(configLoad, "__tables__\n", "", -1)
	configLoad = strings.Replace(configLoad, "__init__\n", "", -1)
	configLoad = strings.Replace(configLoad, "__funcs__\n", "", -1)
	configLoad = strings.Replace(configLoad, "__reload__\n", "", -1)
	configLoad = strings.Replace(configLoad, "__case__\n", "", -1)

	bmsg = []byte(configLoad)
	if err := ioutil.WriteFile(outdir+"config_load.go", bmsg, os.ModePerm); err != nil {
		panic(err.Error())
	}
}

//---------------------------------------------------------------------------------------------
var (
	cfgMgrCS = "using System.Collections.Generic;\nusing Config;\nusing System.IO;\nusing UnityEngine;\nusing System;\npublic static partial class CfgMgr\n{" +
		`
	static CfgMgr()
	{
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

		__TableNames__
        foreach (string name in TableNames)
        {
            Stream sm = null;
            if (File.Exists(path + name))
                sm = new FileStream(path + name, FileMode.Open);
            else
            {
                var ft = Resources.Load(cfgPath + name) as TextAsset;
                sm = new MemoryStream(ft.bytes);
            }
            Type t = Type.GetType("Config." + name);
            cacheTable(t, sm);
			sm.Close();
        }
    }
`

	csName = map[string]string{
		"int32":  "int",
		"int64":  "long",
		"uint32": "uint",
		"uint64": "ulong",
		"string": "string",
	}
)

func parseMgrCS(xlsxFile *xlsx.File) {
	for _, sheet := range xlsxFile.Sheets {
		if strings.Contains(sheet.Name, "Sheet") {
			continue
		}
		fpn := removeSpace(sheet.Rows[pnr].Cells[0].Value) // 首列变量名
		fpt := sheet.Rows[ptr].Cells[0].Value              // 首列变量类型

		cfgMgrCS += "\tstatic Dictionary<" + csName[fpt] + ", " + sheet.Name + ".Types.Record> " + sheet.Name + "_map = new Dictionary<" + csName[fpt] + ", " + sheet.Name + ".Types.Record>();\n"
		cfgMgrCS += "\tpublic static " + sheet.Name + ".Types.Record GetRecordBy" + titleName(fpn) + "(this " + sheet.Name + " obj, " + csName[fpt] + " " + fpn + ")\n"
		cfgMgrCS += "\t{\n\t\tif (" + sheet.Name + "_map.Count != obj.Records.Count)\n\t\t{\n\t\t\t" + sheet.Name + "_map.Clear();\n\t\t\tforeach (" + sheet.Name + ".Types.Record r in obj.Records)\n\t\t\t{\n\t\t\t\t" + sheet.Name + "_map[r." + titleName(fpn) + "] = r;\n\t\t\t}\n\t\t}\n\t\tif (" + sheet.Name + "_map.ContainsKey(" + fpn + "))\n\t\t\t" + "return " + sheet.Name + "_map[" + fpn + "];\n\t\treturn null;\n\t}\n"

		cfgMgrCS = strings.Replace(cfgMgrCS, "__TableNames__", "TableNames.Add(\""+sheet.Name+"\");\n\t\t__TableNames__", -1)
	}
}

func saveMgrCS(outdir string) {
	cfgMgrCS = strings.Replace(cfgMgrCS, "__TableNames__", "", -1)
	cfgMgrCS += "}"
	bmsg := []byte(cfgMgrCS)
	if err := ioutil.WriteFile(outdir+"/CfgMgr2.cs", bmsg, os.ModePerm); err != nil {
		panic(err.Error())
	}
}

//-------------------------------------------------------------------------------------------
func removeSpace(str string) string {
	str = strings.TrimSpace(str)
	return str
}

func titleName(str string) string {
	strs := strings.Split(str, "_")
	ostr := ""
	for i := 0; i < len(strs); i++ {
		_, err := strconv.Atoi(strs[i])
		if err != nil {
			ostr += strings.Title(strs[i])
		} else {
			ostr += "_" + strings.Title(strs[i])
			if i < len(strs)+1 {
				ostr += "_"
			}
		}
	}
	return ostr
}

func value2string(stype string, value string) string {
	if strings.Index(stype, "l") == 0 {
		value = strings.Replace(value, "，", ",", -1) // 中文逗号转英文逗号
		if _, ok := valueParse[stype]; ok {
			strs := strings.Split(valueParse[stype], "values")
			if strings.Index(strs[1], "\"") == 0 { // 字符串List 转换
				value = strings.Replace(value, ",", "\",\"", -1)
			}
			ostr := strs[0] + value + strs[1]
			return ostr
		}
	} else {
		if _, ok := valueParse[stype]; ok {
			strs := strings.Split(valueParse[stype], "value")
			ostr := strs[0] + value + strs[1]
			return ostr
		}

	}

	return value
}

func xlsxFormat(file *xlsx.File) {
	for _, sheet := range file.Sheets {
		if strings.Contains(sheet.Name, "Sheet") {
			continue
		}
		for i := 0; i < len(sheet.Rows); i++ {
			for j := 0; j < len(sheet.Rows[i].Cells); j++ {
				// 移除空格
				sheet.Rows[i].Cells[j].SetValue(removeSpace(sheet.Rows[i].Cells[j].Value))
				// 替换中文逗号
				//sheet.Rows[i].Cells[j].SetValue(strings.Replace(sheet.Rows[i].Cells[j].Value, "，", ",", -1))
				// 移除单元格首位的单引号
				//sheet.Rows[i].Cells[j].SetValue(strings.TrimLeft(sheet.Rows[i].Cells[j].Value, "'"))
			}
		}

		rows := make([]*xlsx.Row, 0)
		for i := 0; i < len(sheet.Rows); i++ {
			if sheet.Rows[i] == nil || sheet.Rows[i].Cells == nil || len(sheet.Rows[i].Cells) == 0 || sheet.Rows[i].Cells[0] == nil || sheet.Rows[i].Cells[0].Value == "" {
				// fmt.Println(sheet.Name, i, "行首列为空，忽略之后行数据")
				break
			}
			row := &xlsx.Row{}
			row.Cells = make([]*xlsx.Cell, 0)
			for j := 0; j < len(sheet.Rows[i].Cells); j++ {
				if sheet.Rows[i].Cells == nil || sheet.Rows[i].Cells[j] == nil || sheet.Rows[i].Cells[j].Value == "" {
					// fmt.Println(sheet.Name, i, "行", j, "列数据为空，忽略该行之后的单元格")
					break
				}
				row.Cells = append(row.Cells, sheet.Rows[i].Cells[j])
			}
			rows = append(rows, row)
		}
		if len(rows) > 1 {
			rl := len(rows[0].Cells)
			for i := 0; i < len(rows); i++ {
				if len(rows[i].Cells) != rl {
					panic(sheet.Name + fmt.Sprint(i) + "行，数据不全")
				}
			}
		}
		sheet.Rows = rows

	}

}

func checkInt(str string) error {
	_, err := strconv.ParseInt(str, 10, 0)
	return err
}

func checkUint(str string) error {
	_, err := strconv.ParseUint(str, 10, 0)
	return err
}

func checkString(str string) error {
	return nil
}

func checkBool(str string) error {
	_, err := strconv.ParseBool(str)
	return err
}

func checkFloat(str string) error {
	_, err := strconv.ParseFloat(str, 32)
	return err
}

func checkListInt(str string) error {
	for _, s := range strings.Split(str, ",") {
		if err := checkInt(s); err != nil {
			return err
		}
	}
	return nil
}

func checkListUint(str string) error {
	for _, s := range strings.Split(str, ",") {
		if err := checkUint(s); err != nil {
			return err
		}
	}
	return nil
}

func checkListString(str string) error {
	for _, s := range strings.Split(str, ",") {
		if err := checkString(s); err != nil {
			return err
		}
	}
	return nil
}
func checkListBool(str string) error {
	for _, s := range strings.Split(str, ",") {
		if err := checkBool(s); err != nil {
			return err
		}
	}
	return nil
}
func checkListFloat(str string) error {
	for _, s := range strings.Split(str, ",") {
		if err := checkFloat(s); err != nil {
			return err
		}
	}
	return nil
}

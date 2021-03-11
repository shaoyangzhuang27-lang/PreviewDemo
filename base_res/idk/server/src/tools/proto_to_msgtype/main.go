// proto_to_msgtype
// 根据proto文件，生成对应的类型定义枚举值文件
// 代码中可通过反射简化编码
package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

var (
	idx        = 0
	outfile    = ""
	codeScript = `
syntax = "proto3";

__package__
__options__

enum MsgType {
`
	packageStr = ""
	optionsStr = ""
)

func main() {
	args := os.Args
	for _, arg := range args {
		if strings.Contains(arg, "-o:") {
			outfile = strings.Split(arg, ":")[1]
		} else if strings.Contains(arg, ".proto") {
			readAllMsg(arg)
		}
	}
	codeScript += "}"
	codeScript = strings.Replace(codeScript, "__package__", packageStr, -1)
	codeScript = strings.Replace(codeScript, "__options__", optionsStr, -1)
	msgtype := []byte(codeScript)
	if err := ioutil.WriteFile(outfile, msgtype, os.ModePerm); err != nil {
		panic(err.Error())
	}
}

func readAllMsg(path string) {
	fi, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer fi.Close()
	fd, err := ioutil.ReadAll(fi)
	if err != nil {
		panic(err)
	}
	fs := string(fd)

	msgs := strings.Split(fs, "\n")
	for _, msg := range msgs {
		msgNoSpace := strings.Replace(msg, " ", "", -1)
		if strings.Index(msgNoSpace, "package") == 0 {
			packageStr += msg + "\n"
		} else if strings.Index(msgNoSpace, "option") == 0 {
			optionsStr += msg + "\n"
		} else if strings.Contains(msg, "message") {
			str := strings.Replace(msg, " ", "", -1)
			str = strings.Replace(str, "\t", "", -1)
			if strings.Index(str, "//") != 0 {
				name := strings.Split(str, "message")[1]
				name = strings.Split(name, "{")[0]
				codeScript += "\tThe" + name + " = " + fmt.Sprint(idx) + ";\n"
				idx++
			}
		}
	}

}

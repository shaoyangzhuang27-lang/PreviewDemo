// xmls_to_bytes
// 读取go proto静态数据
// 序列化，并存档为对应的bytes文件
package main

import (
	"config"
	"fmt"
	"io/ioutil"
	"os"
	"strings"
	"xxtea"
)

func main() {
	args := os.Args
	outdir := "."
	sheet := ""

	for _, arg := range args {
		if strings.Contains(arg, "-o:") {
			outdir = strings.Split(arg, ":")[1]
		}
		if strings.Contains(arg, "-s:") {
			sheet = strings.Split(arg, ":")[1]
		}
	}

	if sheet != "" {
		if v, ok := config.TableMap[sheet]; ok {
			fmt.Println("deal ", sheet)
			//2018-11-13增加xxtea加密
			key := []byte("Kp/QG.V|!j7A=utb")
			data := xxtea.Encrypt(v, key)
			if err := ioutil.WriteFile(outdir+"/"+sheet+".bytes", data, os.ModePerm); err != nil {
				panic(err.Error())
			}
		}
	} else {
		for k, v := range config.TableMap {
			//fmt.Println(k, v)
			fmt.Println("deal ", k)
			//2018-11-13增加xxtea加密
			key := []byte("Kp/QG.V|!j7A=utb")
			data := xxtea.Encrypt(v, key)
			if err := ioutil.WriteFile(outdir+"/"+k+".bytes", data, os.ModePerm); err != nil {
				panic(err.Error())
			}
		}
	}

}

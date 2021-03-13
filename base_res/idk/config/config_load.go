package config

import (
	"github.com/golang/protobuf/proto"
	"io/ioutil"
	"os"
	"xxtea"
)
var (
	TableVersions = make(map[string]int64)
	TableMap = make(map[string][]byte)
	EquipIns = &Equip{}
	Map_equip = make(map[int32]*Equip_Record)
)

func init(){
	Init()
}

func Reload(){
	TableVersions = make(map[string]int64)
	TableMap = make(map[string][]byte)
	EquipIns = &Equip{}
	Map_equip = make(map[int32]*Equip_Record)
	Init()
}

func Init(){
	var f *os.File
	var buf []byte
	var err error
	key := []byte("Kp/QG.V|!j7A=utb")
	//--------------------------------------------------------------------
	f, err = os.Open("data/equip.bytes")
	if err != nil {
		panic(err.Error())
	}
	buf, err = ioutil.ReadAll(f)
	if err != nil {
		panic(err.Error())
	}
	buf = xxtea.Decrypt(buf, key)
	err = proto.Unmarshal(buf, EquipIns)
	if err != nil {
		panic(err.Error())
	}
	for i := 0; i < len(EquipIns.Records); i++ {
		record := EquipIns.Records[i]
		Map_equip[record.Id] = record
	}
	TableVersions["equip"] = EquipIns.Version
	TableMap["equip"] = buf
}

func (this *Equip) GetRecordById(id int32) *Equip_Record {
	return Map_equip[id]
}
func ReloadTableEquip() {
	var f *os.File
	var buf []byte
	var err error
	key := []byte("Kp/QG.V|!j7A=utb")
	f, err = os.Open("data/equip.bytes")
	if err != nil {
		panic(err.Error())
	}
	buf, err = ioutil.ReadAll(f)
	if err != nil {
		panic(err.Error())
	}
	buf = xxtea.Decrypt(buf, key)
	err = proto.Unmarshal(buf, EquipIns)
	if err != nil {
		panic(err.Error())
	}
	for i := 0; i < len(EquipIns.Records); i++ {
		record := EquipIns.Records[i]
		Map_equip[record.Id] = record
	}
	TableVersions["equip"] = EquipIns.Version
	TableMap["equip"] = buf
}
func ReloadTable(table_name string) {
	switch table_name {
	case "equip":
		ReloadTableEquip()
	}
}


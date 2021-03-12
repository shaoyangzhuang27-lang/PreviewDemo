@echo off
::::::::::::::::::::::::::::::::::::::::::::::::::::::
::ready work
::::::::::::::::::::::::::::::::::::::::::::::::::::::
set GOPATH=%GOPATH%;%cd%\..\server\

echo=
echo ---------- GOPATH is ----------
echo %GOPATH%

echo=
echo ---------- go get ... ----------
go get github.com/tealeg/xlsx
go get github.com/golang/protobuf/proto

::::::::::::::::::::::::::::::::::::::::::::::::::::::
::xmls_to_proto.exe
::::::::::::::::::::::::::::::::::::::::::::::::::::::
echo=
echo ---------- generate xmls_to_proto.exe ----------
if exist ".\tools\xmls_to_proto.exe" (
	for %%i in (".\tools\xmls_to_proto.exe" "..\server\src\tools\xmls_to_proto\main.go") do (
		::echo %%i
		set %%~ni=%%~ti
	)

	if %%main lss %%xmls_to_proto (
		go build -o .\tools\xmls_to_proto.exe tools\xmls_to_proto
	)
) else (
	go build -o .\tools\xmls_to_proto.exe tools\xmls_to_proto
)

::::::::::::::::::::::::::::::::::::::::::::::::::::::
::generate and copy all bytes
::::::::::::::::::::::::::::::::::::::::::::::::::::::
echo=
echo ---------- generate and copy all bytes ----------
::del /q ..\server\src\config\config_load.go

for /f %%i in ('dir .\input /a/b/o:ed ') do (
	echo %%i
	.\tools\xmls_to_proto -i:input -o:.\ -f:%%i
	..\proto\tools\win\bin\protoc.exe --go_out=.\ --csharp_out=.\ config.proto
	move /y config.pb.go ..\server\src\config\config.pb.go
	move /y config_init.go ..\server\src\config\config_init.go
	go build -o .\tools\xmls_to_bytes.exe tools\xmls_to_bytes
	.\tools\xmls_to_bytes -o:.\output
)

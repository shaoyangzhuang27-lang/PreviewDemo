@echo off
set GOPATH=%GOPATH%;%cd%\..\server\

echo=
echo=
echo -------------- proto_to_msgtype --------------
if exist ".\tools\proto_to_msgtype.exe" (
	for %%i in (".\tools\proto_to_msgtype.exe" "..\server\src\tools\proto_to_msgtype\main.go") do (
		set %%~ni=%%~ti
	)

	if %%main lss %%proto_to_msgtype (
		echo "rebuild tool"
		go build -o .\tools\proto_to_msgtype.exe tools\proto_to_msgtype
	) else (
		echo "newest tool"
	)
) else (
	echo "create tool"
	go build -o .\tools\proto_to_msgtype.exe tools\proto_to_msgtype
)

echo=
echo .\tools\proto_to_msgtype.exe -o:.\msg_type.proto  msg.proto 
.\tools\proto_to_msgtype.exe -o:.\msg_type.proto  msg.proto 

::REM .\tools\proto_to_msgtype.exe -o:.\server_msg_type.proto server_msg.proto
::REM .\tools\proto_to_msgtype.exe -o:.\pvp_msg_type.proto pvp_msg.proto
::rem .\tools\win\bin\protoc --proto_path=IMPORT_PATH --cpp_out=DST_DIR --java_out=DST_DIR --python_out=DST_DIR --go_out=DST_DIR --ruby_out=DST_DIR --javanano_out=DST_DIR --objc_out=DST_DIR --csharp_out=DST_DIR path/to/file.proto

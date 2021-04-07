For /f "tokens=1* delims=:" %%i in ('Type text.txt^|Findstr /n ".*"') do (
Echo %%j
java -jar sfnttool.jar -s '%%j' simfang.ttf font.ttf
)
pause
@REM 現在のディレクトリを変数に入れる
set current_dir=%~dp0

@REM 親ディレクトリへ移動
cd ./../

@REM tempフォルダを空にする
rmdir /s /q temp
mkdir temp

@REM 全てのファイルをコピー
xcopy %current_dir% temp /D /S /R /Y /I /K

@REM tempフォルダに移動
cd temp

@REM パッケージに同梱しないファイルを削除する
del makezip.bat
del autolive.zip
del .gitignore
rmdir /s /q ".git"
rmdir /s /q ".idea"

@REM 古いパッケージを削除する
del %current_dir%autolive.zip

@REM パッケージの作成
"C:\Program Files\7-Zip\7z.exe" a %current_dir%autolive.zip *

@REM tempフォルダを空にする
cd ./../
rmdir /s /q temp
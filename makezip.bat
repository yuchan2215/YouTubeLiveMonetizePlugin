rmdir temp
mkdir temp
copy * temp
cd temp
del makezip.bat
del autolive.zip
del .gitignore
"C:\Program Files\7-Zip\7z.exe" a ./../autolive.zip *
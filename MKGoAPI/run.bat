@echo off
REM run like this to skip cmd's "Terminate batch job (Y/N)?" question:
REM run.bat < nul
go build && MKGoAPI -es_url "https://search-sve-test-bdwhx3oa447ij3yezaokfdeup4.us-east-1.es.amazonaws.com"
del MKGoAPI.exe

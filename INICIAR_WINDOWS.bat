@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Iniciando o cardapio da Pizzaria Peranzza (Java + Spring Boot)...
echo Requisitos: JDK 21 e Maven 3.9+
where mvn >nul 2>&1
if errorlevel 1 (
  echo Maven nao encontrado. Instale Maven e adicione-o ao PATH.
  pause
  exit /b 1
)
mvn spring-boot:run
pause

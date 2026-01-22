cat > manage.sh << 'EOF'
#!/bin/bash
echo "Gestión de SourceSeal Colombia Protocol"
echo "1. Usar app.js"
echo "2. Usar server.js"  
echo "3. Usar simple-server.js"
echo "4. Verificar puertos"
read -p "Opción: " choice

case $choice in
  1) pkill -f node; node app.js ;;
  2) pkill -f node; node server.js ;;
  3) pkill -f node; node simple-server.js ;;
  4) netstat -tulpn | grep node ;;
  *) echo "Opción inválida" ;;
esac
EOF

chmod +x manage.sh
#!/usr/bin/env bash
# Very simple worker placeholder: in production use BullMQ worker to generate PDF via puppeteer
INTERN_ID="$1"
CERT_NO="$2"
CERT_DIR="${CERT_DIR:-./storage/certs}"
TEMPLATE="$(pwd)/templates/cert_template.ejs"
PDF_PATH="${CERT_DIR}/${CERT_NO}.pdf"
# Render HTML using node script (simple)
node -e "const ejs=require('ejs');const fs=require('fs');const html=ejs.render(fs.readFileSync('$TEMPLATE','utf8'), {internId:$INTERN_ID, certNo:'$CERT_NO', issuedDate:new Date().toLocaleDateString(), centreName:'A.A Dynamic Computer Training Center Bakori'}); fs.writeFileSync('$CERT_DIR/${CERT_NO}.html', html);"
# Use puppeteer to render PDF
node -e "(async()=>{const puppeteer=require('puppeteer');const fs=require('fs');const browser=await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});const page=await browser.newPage();await page.setContent(fs.readFileSync('$CERT_DIR/${CERT_NO}.html','utf8'),{waitUntil:'networkidle0'});await page.pdf({path:'$PDF_PATH', format:'A4', printBackground:true});await browser.close();console.log('PDF generated');})()"
# Update DB (requires environment configured for mysql client) - in real worker use DB client to update file_path
# echo "UPDATE certificates SET file_path='${PDF_PATH}', status='approved' WHERE cert_no='${CERT_NO}';" | mysql -h${DB_HOST:-localhost} -u${DB_USER:-aa} -p${DB_PASS:-aa} ${DB_NAME:-aa_dynamic}

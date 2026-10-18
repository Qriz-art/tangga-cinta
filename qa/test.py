from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1150},device_scale_factor=1)
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://localhost:4200');page.wait_for_timeout(1500)
 page.screenshot(path='/home/user/tangga-cinta/qa/desktop.png',full_page=True)
 assert page.locator('.square').count()==64
 page.get_by_role('button',name='Ubah nama').click();page.get_by_role('textbox',name='Nama pemain 1').fill('Naya');page.get_by_role('textbox',name='Nama pemain 2').fill('Dimas');page.get_by_role('button',name='Simpan nama').click()
 page.get_by_role('button',name='Lempar dadu',exact=True).click();page.wait_for_timeout(3500)
 if page.get_by_role('button',name='Sudah! Simpan kartu').count(): page.get_by_role('button',name='Sudah! Simpan kartu').click()
 assert page.locator('.turn-tag').inner_text()=='GILIRAN DIMAS'
 page.reload();page.wait_for_timeout(600);assert 'Naya' in page.locator('.players-panel').inner_text()
 page.evaluate("""() => {let s=JSON.parse(localStorage.getItem('tangga-cinta-v1'));s.positions=[22,1];s.turn=0;s.pending=null;s.winner=null;localStorage.setItem('tangga-cinta-v1',JSON.stringify(s));}""")
 page.reload();page.wait_for_timeout(600)
 page.evaluate('() => {crypto.getRandomValues = a => {a[0]=0;return a;};}')
 page.get_by_role('button',name='Lempar dadu',exact=True).click();page.wait_for_timeout(3300)
 assert page.get_by_role('dialog').is_visible()
 assert 'KARTU CERITA' in page.get_by_role('dialog').inner_text()
 assert page.evaluate("JSON.parse(localStorage.getItem('tangga-cinta-v1')).positions[0]")==6
 page.screenshot(path='/home/user/tangga-cinta/qa/card.png')
 page.get_by_role('button',name='Sudah! Simpan kartu').click()
 page.locator('.collection-link').click();assert page.locator('.collected-list article').count()>=1
 page.get_by_role('button',name='Kembali bermain').click()
 page.get_by_role('button',name='Mulai ulang',exact=True).click();page.get_by_role('button',name='Ya, mulai ulang').click()
 assert page.evaluate("JSON.parse(localStorage.getItem('tangga-cinta-v1')).positions")==[1,1]
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path='/home/user/tangga-cinta/qa/mobile.png',full_page=True)
 assert page.evaluate('document.documentElement.scrollWidth')==390
 print('PASS: 64 squares, name editing, roll and turn, persistence, snake to card, collect, reset, mobile overflow. Errors:',errors)
 b.close()

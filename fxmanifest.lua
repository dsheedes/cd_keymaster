fx_version 'cerulean'
game 'gta5'
author 'discord.gg/codesign'
description 'Codesign KeyMaster Mini-Game'
version '1.0.0'
lua54 'yes'

client_script 'client/client.lua'
server_script 'server/version_check.lua'

ui_page {
    'html/index.html',
}
files {
    'html/index.html',
    'html/css/*css',
    'html/js/*.js',
}

export 'StartKeyMaster'
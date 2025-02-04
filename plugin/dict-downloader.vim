if exists('g:loaded_dict_downloader')
  finish
endif
let g:loaded_dict_downloader = 1

augroup dict-downloader
  autocmd!
  autocmd User DenopsPluginPost:dict-downloader call denops#notify('dict-downloader', 'init', [])
augroup END


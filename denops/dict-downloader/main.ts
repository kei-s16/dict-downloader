import type { Entrypoint } from "jsr:@denops/std@7.4.0";
import * as vars from "jsr:@denops/std@7.4.0/variable";
import { DictDownloader } from "./download.ts"

export const main: Entrypoint = (denops) => {
  const downloader = new DictDownloader;

  denops.dispatcher = {
    async init() {
      await denops.cmd(
        `command! -nargs=? DictDownload echomsg denops#request('${denops.name}', 'download', [<q-args>])`,
      );
    },

    async download() {
      // TODO: change var name
      const dicts = await vars.globals.get(denops, "dict_downloader_dicts") as Array<string>;
      const savepath = await vars.globals.get(denops, "dict_downloader_save_path") as string;

      try {
        dicts.forEach(async (dict) => {
          await downloader.fetchDictionary(dict, savepath);
        });

        return `Downloaded.`;
      } catch (e) {
        console.error(e.message);
      }
    }
  };
}


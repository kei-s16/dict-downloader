import os from 'node:os';

export class DictDownloader {
    /**
     * 辞書をダウンロードする
     *
     * @param dictUrl - ダウンロードする辞書のURL
     * @param dictDir - 保存先のパス
     */
    async fetchDictionary(dictUrl: string, dictDir: string) : Promise<void|Error> {
      const url = new URL(dictUrl);
      const path = this.dictDirResolver(dictDir);
      const dictName = this.dictNameResolver(url);

      if (!dictName) {
        return new Error("渡されたURLが不正"); // TODO: fix error
      }

      const dest = path.concat(dictName);

      try {
        const response = await fetch(url, {method: "GET"});

        if (response.body) {
          const savedFile = await Deno.open(dest, {write: true, create: true});
          await response.body.pipeTo(savedFile.writable);
        }

        // 保存されたファイルがgzなら解凍する
        const dictFile = await Deno.open(dest, {read: true});
        if (dictFile && dest.endsWith(".gz")) { // TODO: ほんとはファイルタイプ見るべきなので直す
          const unzipPath = await Deno.create(dest.slice(0, -3));
          const unzipStream = unzipPath.writable;
          const stream = new DecompressionStream("gzip");
          dictFile.readable.pipeThrough(stream).pipeTo(unzipStream);
        }

      } catch (e) {
        console.error(e.message);
      }
    };

    /**
     * 保存先パスを絶対パスに変換する
     *
     * @param dictDir - 保存先のパス
     * @returns 保存先パスを絶対パスに変換したもの
     */
    dictDirResolver(dictDir: string) : String {
      const regex = /^~\//
      const path = new String(dictDir).replace(regex, `${os.homedir()}/`);

      if (!path.endsWith('/')) {
        return path.concat("/");
      }

      return path;
    };

    /**
     * ダウンロードURLから辞書名を取得する
     *
     * @param url - 辞書のダウンロードURL
     * @returns 辞書名らしきもの
     */
    dictNameResolver(url: URL) : string|undefined {
      return url.pathname.split("/").pop();
    }
}


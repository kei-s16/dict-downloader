import os from 'node:os';

export class DictDownloader {
    // TODO: add docs
    async fetchDictionary(dictUrl: string, dictDir: string) : Promise<void> {
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

    // TODO: add docs
    dictDirResolver(dictDir: string) : String {
      const regex = /^~\//
      const path = new String(dictDir).replace(regex, `${os.homedir()}/`);

      if (!path.endsWith('/')) {
        return path.concat("/");
      }

      return path;
    };

    // TODO: add docs
    dictNameResolver(url: URL) : string|undefined {
      return url.pathname.split("/").pop();
    }
}


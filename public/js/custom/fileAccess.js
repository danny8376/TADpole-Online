function loadFiles() {
  return new Promise((resolve, reject) => {
    let fileDsiware = document.getElementById("dsiware");
    let fileMovable = document.getElementById("movable");
    let fileGame = document.getElementById("game");
    let fileSave = document.getElementById("save");
    //let fileCtcert = document.getElementById("ctcert");

    //if (!fileDsiware.files.length || !fileMovable.files.length || !fileGame.files.length
    //  || !fileSave.files.length || !fileCtcert.files.length)
    //  return reject('Not all files provided');

    let promises = [];
    //promises.push(loadFile(fileDsiware));
    promises.push(loadDummy());
    promises.push(loadFile(fileMovable));
    //promises.push(loadFile(fileGame));
    promises.push(loadDummy());
    //promises.push(loadFile(fileSave));
    promises.push(loadDummy());
    //promises.push(loadFile(fileCtcert));
    //promises.push(loadUrl("https://raw.githubusercontent.com/zoogie/TADpole/master/resources/ctcert.bin")); // ctcert
    promises.push(loadDummy()); // ctcert
    promises.push(loadUrl("https://raw.githubusercontent.com/zoogie/Bannerbomb3/master/bb3_payload/TADmuffinPC/data/rop_payload.bin"));
    Promise.all(promises).then(data => {
      resolve(data);
    });
  });
}

function loadFile(input) {
  return new Promise(resolve => {
    let reader = new FileReader();
    reader.onload = function () {
      resolve(new Uint8Array(reader.result));
    };
    reader.readAsArrayBuffer(input.files[0]);
  });
}

function loadUrl(url) {
  return new Promise(resolve => {
    fetch(url).then((response) => {
      return response.arrayBuffer().then(result => {
          resolve(new Uint8Array(result));
      });
    });
  });
}

function loadDummy() {
  return new Promise(resolve => {
    resolve(new Uint8Array([]));
  });
}

function download(dsiwareFinal) {
  let dsiwareName = /*$('#dsiware')[0].files[0].name || */'F00D43D5.bin';
  dsiwareName = dsiwareName.substr(0, dsiwareName.length - 4).substr(0, 25).concat('.bin');
  let a = window.document.createElement('a');
  a.href = window.URL.createObjectURL(new Blob([dsiwareFinal], { type: 'application/octet-stream' }));
  //a.download = `${dsiwareName}.patched`;
  a.download = dsiwareName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

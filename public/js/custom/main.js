function start() {
  $('.btn-startInjection')[0].disabled = true;
  document.getElementById("p-error").innerHTML = '';
  loadFiles().then(data => {
    let dsiware = data[0];
    let movable = data[1];
    let game = data[2];
    let save = data[3];
    let ctcert = data[4];
    let payload = data[5];

    /* Validation */
    if (movable.length !== 0x140 && movable.length !== 0x120) throw new Error('movable.sed size not valid');
    //if (ctcert.length !== 0x19E) throw new Error('ctcert.bin not valid');

    /*
    let crcGame = getCrc(game);
    if (!constants.hashes.srl.includes(crcGame)) throw new Error('game_XXX.app is not valid');
    let crcSave = getCrc(save);
    if (!constants.hashes.save.includes(crcSave)) throw new Error('public_XXX.sav is not valid');
    */

    /* Data Extraction */
    /*
    let locC = constants.dataLocations.ctcert;
    let publicKeyR = sliceArr(ctcert, locC.publicKeyR.off, locC.publicKeyR.len);
    let publicKeyS = sliceArr(ctcert, locC.publicKeyS.off, locC.publicKeyS.len);
    let privateKey = sliceArr(ctcert, locC.privateKey.off, locC.privateKey.len);
    */

    let locM = constants.dataLocations.movable;
    let movableKeyY = sliceArr(movable, locM.keyY.off, locM.keyY.len);
    let normalKey = extractNormalKey(movableKeyY, constants.keys.keyX);
    //let dsiwareData = extractDsiware(dsiware, normalKey);
    //if (!dsiwareData) throw new Error('DSiWare.bin can not be decrypted with the provided movable.sed');

    let banner = new Uint8Array(0x4000);
    banner.set([0x03, 0x01]);
    for (let i = 0; i < 8; i++) banner.set(payload, 0x240 + payload.length * i);
    banner.set(parseHexString(crc16(banner.slice(0x20, 0x840)).toString(16)).reverse(), 0x02);
    banner.set(parseHexString(crc16(banner.slice(0x20, 0x940)).toString(16)).reverse(), 0x04);
    banner.set(parseHexString(crc16(banner.slice(0x20, 0xA40)).toString(16)).reverse(), 0x06);
    banner.set(parseHexString(crc16(banner.slice(0x1240, 0x23C0)).toString(16)).reverse(), 0x08);

    let dsiwareData = {
        banner: banner,
        // python: b"3DFT"+struct.pack(">I",4)+(b"\x42"*0x20)+(b"\x99"*0x10)+struct.pack("<Q",0x0004800500000000+tidlow)+(b"\x00"*0xB0)
        header: new Uint8Array([0x33, 0x44, 0x46, 0x54, 0x00, 0x00, 0x00, 0x04, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x42, 0x99, 0x99, 0x99, 0x99, 0x99, 0x99, 0x99, 0x99, 0x99, 0x99, 0x99, 0x99, 0x99, 0x99, 0x99, 0x99, 0xd5, 0x43, 0x0d, 0xf0, 0x05, 0x80, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
        footer: new Uint8Array(0x4E0),
        other: {}
    };


    /* Game & Region checks */
    //validateDsiwareRegion(dsiwareData, game, crcGame, crcSave);

    /* msed_data extraction */
    let msedDataHex = extractMsedData(movable);
    let movableCrc = getCrc(movable);

    /* app replacing */
    /*
    let srl = dsiwareData.other['srl.nds'];
    if (game.length > srl.length) throw new Error('Game not compatible');
    let end = sliceArr(srl, game.length, srl.length - game.length);
    let newApp = new Uint8Array(game.length + end.length);
    newApp.set(game);
    newApp.set(end, game.length);
    */

    /* sav replacing */
    /*
    let sav = dsiwareData.other['public.sav'];
    if (save.length > sav.length) throw new Error('Save not compatible with this game');
    end = sliceArr(sav, save.length, sav.length - save.length);
    let newSav = new Uint8Array(save.length + end.length);
    newSav.set(save);
    newSav.set(end, save.length);
    */

    /* update data */
    /*
    dsiwareData.other['srl.nds'] = newApp;
    dsiwareData.other['public.sav'] = newSav;
    */

    /* update footer hashes & add ctcert/pubkey */
    dsiwareData = rebuildFooter(dsiwareData, ctcert);

    /* signing */
    /*
    let body = {
      publicKeyR: byteArrToHexStr(publicKeyR),
      publicKeyS: byteArrToHexStr(publicKeyS),
      privateKey: byteArrToHexStr(privateKey),
      hashesBlock: byteArrToHexStr(sha256.array(dsiwareData.hashesBlock)),
      apcert: byteArrToHexStr(sha256.array(dsiwareData.apcert)),
      msedDataHex: msedDataHex,
      movableCrc: movableCrc,
    };
    */

    dsiwareData.dsiwareLength = dsiware.length;
    dsiwareData.keys = {
      movableKeyY: movableKeyY,
      normalKey: normalKey,
    };

    /* Signing */
    //return signData(body, dsiwareData);
    return new Promise((resolve) => {
      resolve({
        signatures: {},
        dsiwareData: dsiwareData
      });
    });
  }).then(sigData => {
    let { sigHashesBlock, sigApcert } = sigData.signatures;
    let dsiwareData = sigData.dsiwareData;

    //sigHashesBlock = parseHexString(sigHashesBlock);
    //sigApcert = parseHexString(sigApcert);

    /* inject signatures */
    //dsiwareData = injectSignatures(dsiwareData, sigHashesBlock, sigApcert);

    /* rebuild dsiware */
    let dsiwareFinal = buildDsiware(dsiwareData, dsiwareData.dsiwareLength);

    /* offer file to download */
    download(dsiwareFinal);

    /* End */
    console.log('Done');
    $('.btn-startInjection')[0].disabled = false;
  }).catch(error => {
    abort(error.message || error);
  });
}

import { ethers } from "ethers";
import fs from 'fs'
import path from 'path'
import { GifCodec } from 'gifwrap'


export const init = async () => {
  let signer = null;

  let provider;
  if (window.ethereum == null) {

    // If MetaMask is not installed, we use the default provider,
      // which is backed by a variety of third-party services (such
        // as INFURA). They do not have private keys installed,
      // so they only have read-only access
    console.log("MetaMask not installed; using read-only defaults")
    provider = ethers.getDefaultProvider()

  } else {

    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
      provider = new ethers.BrowserProvider(window.ethereum)

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
      signer = await provider.getSigner();
  }

  return {
    signer,
    provider
  }
}
let cachedFrames = null;

export async function getDecodedGifFrames() {
  if (cachedFrames) return cachedFrames;

  const gifPath = path.join(process.cwd(), 'public', 'disk_black_medium.gif');
  const codec = new GifCodec();
  const gifBuffer = fs.readFileSync(gifPath);
  const decodedGif = await codec.decodeGif(gifBuffer);

  cachedFrames = decodedGif.frames; // raw frames, ready to be drawn onto
  return cachedFrames;
}


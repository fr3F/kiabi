import { initRFIDReader } from "./uhf.reader.service.js";
import { createNewProduct, getLastTagByUID, updateProductStatus } from "./util/rfid.js";


async function postTags(uid) {
  const existing = await getLastTagByUID(uid);
  if (existing) {
    return await updateProductStatus(existing);
  } else {
    return await createNewProduct(uid);
  }
}

export {
  postTags,
  initRFIDReader
};

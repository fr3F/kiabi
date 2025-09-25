const { ShpShipment } = require("../../../models");
const { getNextDestockingNumber } = require("../../../services/utils/dernier-numero.service");

async function setDestockingNumber(shipment, transaction) {
    const itemDSK = shipment.items.find((r)=> r.expectedQty > r.receivedQty);
    if(!itemDSK)
        return;
    shipment.destockingNumber = await getNextDestockingNumber(transaction);
    await updateDestockingNumber(shipment, transaction);
}

async function updateDestockingNumber(shipment, transaction) {
    await ShpShipment.update({ destockingNumber: shipment.destockingNumber }, 
        { where: { id: shipment.id }, transaction }
    );
}

module.exports = {
    setDestockingNumber
}
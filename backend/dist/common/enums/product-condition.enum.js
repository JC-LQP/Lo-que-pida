"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCondition = void 0;
const graphql_1 = require("@nestjs/graphql");
var ProductCondition;
(function (ProductCondition) {
    ProductCondition["NEW"] = "NEW";
    ProductCondition["USED"] = "USED";
    ProductCondition["REFURBISHED"] = "REFURBISHED";
})(ProductCondition || (exports.ProductCondition = ProductCondition = {}));
(0, graphql_1.registerEnumType)(ProductCondition, {
    name: 'ProductCondition',
});
//# sourceMappingURL=product-condition.enum.js.map
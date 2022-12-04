"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _UserPrecondition_message;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPrecondition = void 0;
const framework_1 = require("@sapphire/framework");
class UserPrecondition extends framework_1.AllFlowsPrecondition {
    constructor() {
        super(...arguments);
        _UserPrecondition_message.set(this, 'This command can only be used by the owner.');
    }
    chatInputRun(interaction) {
        return this.doOwnerCheck(interaction.user.id);
    }
    contextMenuRun(interaction) {
        return this.doOwnerCheck(interaction.user.id);
    }
    messageRun(message) {
        return this.doOwnerCheck(message.author.id);
    }
    doOwnerCheck(userId) {
        return process.env.OWNER_IDS.includes(userId) ? this.ok() : this.error({
            message: __classPrivateFieldGet(this, _UserPrecondition_message, "f"),
            identifier: 'OwnerOnly',
        });
    }
}
exports.UserPrecondition = UserPrecondition;
_UserPrecondition_message = new WeakMap();

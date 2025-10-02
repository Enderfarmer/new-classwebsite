import { ref, update, onValue, get } from "firebase/database";
import { User } from "firebase/auth";
import db from "./db";

export default function nameFromEMail(email) {
    const name = email.split(".")[0].replace(email[0], email[0].toUpperCase());
    if (name === "Artem") {
        return "Arti";
    }
    return name;
}
/**
 *
 * @param {String} str
 */
export const beginWithCapital = (str) => {
    return str[0].toUpperCase() + str.slice(1);
};
/**
 *
 * @param {Date} date
 */
export const formatDate = (date, withDate = true, withTime = true) => {
    let formatted = "";
    if (withTime) {
        formatted = `Um ${date.getHours()}:${
            date.getMinutes() < 10
                ? "0".concat(date.getMinutes().toString())
                : date.getMinutes()
        } `;
    }
    if (withDate) {
        formatted += `${!withTime ? "A" : "a"}m ${date.getDate()}.${
            date.getMonth() + 1
        }.${date.getFullYear()}`;
    }
    return formatted;
};
export const addOrRemove = (/**@type {Array} array */ array, value) => {
    var index = array.indexOf(value);

    if (index === -1) {
        array.push(value);
    } else {
        array.splice(index, 1);
    }
    return array;
};

export const updateLevel = (/**@type {User}*/ user) => {
    const userRef = ref(db, `users/${user.uid}`);
    onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            const currentLevel = userData.level || 1;
            const currentXP = userData.xp || 1;
            const newLevel = Math.floor(Math.log2(currentXP)) + 1;
            if (newLevel !== currentLevel) {
                update(userRef, { level: newLevel });
            }
        }
    });
};
export const addXP = (/**@type {User}*/ user, xpToAdd) => {
    const userRef = ref(db, `users/${user.uid}`);
    get(userRef).then((snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            const currentXP = userData.xp || 1;
            update(userRef, { xp: currentXP + xpToAdd });
            updateLevel(user);
        }
    });
};
export const removeXP = (/**@type {User}*/ user, xpToRemove) => {
    const userRef = ref(db, `users/${user.uid}`);
    get(userRef).then((snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            const currentXP = userData.xp || 1;
            const newXP = currentXP - xpToRemove;
            update(userRef, { xp: newXP < 1 ? 1 : newXP });
            updateLevel(user);
        }
    });
};

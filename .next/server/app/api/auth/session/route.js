/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/session/route";
exports.ids = ["app/api/auth/session/route"];
exports.modules = {

/***/ "(rsc)/./app/api/auth/session/route.ts":
/*!***************************************!*\
  !*** ./app/api/auth/session/route.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_server_auth_session__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/server/auth-session */ \"(rsc)/./lib/server/auth-session.ts\");\n\n\nasync function GET(request) {\n    const secure = \"development\" === \"production\";\n    const token = request.cookies.get(_lib_server_auth_session__WEBPACK_IMPORTED_MODULE_1__.SESSION_COOKIE_NAME)?.value;\n    if (!token) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            user: null\n        }, {\n            status: 200\n        });\n    }\n    const payload = (0,_lib_server_auth_session__WEBPACK_IMPORTED_MODULE_1__.verifySessionToken)(token);\n    if (!payload) {\n        const res = next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            user: null\n        }, {\n            status: 200\n        });\n        res.cookies.set(_lib_server_auth_session__WEBPACK_IMPORTED_MODULE_1__.SESSION_COOKIE_NAME, \"\", {\n            httpOnly: true,\n            sameSite: \"lax\",\n            secure,\n            maxAge: 0,\n            path: \"/\"\n        });\n        return res;\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        user: {\n            email: payload.email,\n            role: payload.role\n        }\n    }, {\n        status: 200\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvc2Vzc2lvbi9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBd0Q7QUFDNEI7QUFFN0UsZUFBZUcsSUFBSUMsT0FBb0I7SUFDNUMsTUFBTUMsU0FBU0Msa0JBQXlCO0lBQ3hDLE1BQU1DLFFBQVFILFFBQVFJLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDUix5RUFBbUJBLEdBQUdTO0lBQ3hELElBQUksQ0FBQ0gsT0FBTztRQUNWLE9BQU9QLHFEQUFZQSxDQUFDVyxJQUFJLENBQUM7WUFBRUMsTUFBTTtRQUFLLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQ3pEO0lBRUEsTUFBTUMsVUFBVVosNEVBQWtCQSxDQUFDSztJQUNuQyxJQUFJLENBQUNPLFNBQVM7UUFDWixNQUFNQyxNQUFNZixxREFBWUEsQ0FBQ1csSUFBSSxDQUFDO1lBQUVDLE1BQU07UUFBSyxHQUFHO1lBQUVDLFFBQVE7UUFBSTtRQUM1REUsSUFBSVAsT0FBTyxDQUFDUSxHQUFHLENBQUNmLHlFQUFtQkEsRUFBRSxJQUFJO1lBQUVnQixVQUFVO1lBQU1DLFVBQVU7WUFBT2I7WUFBUWMsUUFBUTtZQUFHQyxNQUFNO1FBQUk7UUFDekcsT0FBT0w7SUFDVDtJQUVBLE9BQU9mLHFEQUFZQSxDQUFDVyxJQUFJLENBQUM7UUFBRUMsTUFBTTtZQUFFUyxPQUFPUCxRQUFRTyxLQUFLO1lBQUVDLE1BQU1SLFFBQVFRLElBQUk7UUFBQztJQUFFLEdBQUc7UUFBRVQsUUFBUTtJQUFJO0FBQ2pHIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXE5CVEMtU1lTSUQtMDAxM1xcRG9jdW1lbnRzXFxEZXZlbG9wbWVudFxcbmV3IFdlYiBzdG9yZVxcbmV3IFdlYiBzdG9yZVxcbmV4dC1zdG9yZVxcYXBwXFxhcGlcXGF1dGhcXHNlc3Npb25cXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcclxuaW1wb3J0IHsgU0VTU0lPTl9DT09LSUVfTkFNRSwgdmVyaWZ5U2Vzc2lvblRva2VuIH0gZnJvbSBcIkAvbGliL3NlcnZlci9hdXRoLXNlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcclxuICBjb25zdCBzZWN1cmUgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCI7XHJcbiAgY29uc3QgdG9rZW4gPSByZXF1ZXN0LmNvb2tpZXMuZ2V0KFNFU1NJT05fQ09PS0lFX05BTUUpPy52YWx1ZTtcclxuICBpZiAoIXRva2VuKSB7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyB1c2VyOiBudWxsIH0sIHsgc3RhdHVzOiAyMDAgfSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBwYXlsb2FkID0gdmVyaWZ5U2Vzc2lvblRva2VuKHRva2VuKTtcclxuICBpZiAoIXBheWxvYWQpIHtcclxuICAgIGNvbnN0IHJlcyA9IE5leHRSZXNwb25zZS5qc29uKHsgdXNlcjogbnVsbCB9LCB7IHN0YXR1czogMjAwIH0pO1xyXG4gICAgcmVzLmNvb2tpZXMuc2V0KFNFU1NJT05fQ09PS0lFX05BTUUsIFwiXCIsIHsgaHR0cE9ubHk6IHRydWUsIHNhbWVTaXRlOiBcImxheFwiLCBzZWN1cmUsIG1heEFnZTogMCwgcGF0aDogXCIvXCIgfSk7XHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgdXNlcjogeyBlbWFpbDogcGF5bG9hZC5lbWFpbCwgcm9sZTogcGF5bG9hZC5yb2xlIH0gfSwgeyBzdGF0dXM6IDIwMCB9KTtcclxufVxyXG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiU0VTU0lPTl9DT09LSUVfTkFNRSIsInZlcmlmeVNlc3Npb25Ub2tlbiIsIkdFVCIsInJlcXVlc3QiLCJzZWN1cmUiLCJwcm9jZXNzIiwidG9rZW4iLCJjb29raWVzIiwiZ2V0IiwidmFsdWUiLCJqc29uIiwidXNlciIsInN0YXR1cyIsInBheWxvYWQiLCJyZXMiLCJzZXQiLCJodHRwT25seSIsInNhbWVTaXRlIiwibWF4QWdlIiwicGF0aCIsImVtYWlsIiwicm9sZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/session/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/server/auth-session.ts":
/*!************************************!*\
  !*** ./lib/server/auth-session.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SESSION_COOKIE_NAME: () => (/* binding */ SESSION_COOKIE_NAME),\n/* harmony export */   createSessionToken: () => (/* binding */ createSessionToken),\n/* harmony export */   verifySessionToken: () => (/* binding */ verifySessionToken)\n/* harmony export */ });\n/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:crypto */ \"node:crypto\");\n/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_crypto__WEBPACK_IMPORTED_MODULE_0__);\n\nconst SESSION_COOKIE_NAME = \"shopfront_session\";\nconst SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;\nfunction getSecret() {\n    return process.env.AUTH_SECRET || \"dev-only-change-me\";\n}\nfunction toBase64Url(input) {\n    return Buffer.from(input, \"utf8\").toString(\"base64url\");\n}\nfunction fromBase64Url(input) {\n    return Buffer.from(input, \"base64url\").toString(\"utf8\");\n}\nfunction sign(payloadB64) {\n    return (0,node_crypto__WEBPACK_IMPORTED_MODULE_0__.createHmac)(\"sha256\", getSecret()).update(payloadB64).digest(\"base64url\");\n}\nfunction createSessionToken(email, role) {\n    const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;\n    const payload = {\n        email: email.toLowerCase(),\n        role,\n        exp\n    };\n    const payloadB64 = toBase64Url(JSON.stringify(payload));\n    const sig = sign(payloadB64);\n    return `${payloadB64}.${sig}`;\n}\nfunction verifySessionToken(token) {\n    const [payloadB64, sig] = token.split(\".\");\n    if (!payloadB64 || !sig) {\n        return null;\n    }\n    const expected = sign(payloadB64);\n    const sigBuf = Buffer.from(sig);\n    const expectedBuf = Buffer.from(expected);\n    if (sigBuf.length !== expectedBuf.length || !(0,node_crypto__WEBPACK_IMPORTED_MODULE_0__.timingSafeEqual)(sigBuf, expectedBuf)) {\n        return null;\n    }\n    try {\n        const payload = JSON.parse(fromBase64Url(payloadB64));\n        if (!payload?.email || !payload?.role || !payload?.exp) {\n            return null;\n        }\n        const now = Math.floor(Date.now() / 1000);\n        if (payload.exp < now) {\n            return null;\n        }\n        return payload;\n    } catch  {\n        return null;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc2VydmVyL2F1dGgtc2Vzc2lvbi50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUEwRDtBQUVuRCxNQUFNRSxzQkFBc0Isb0JBQW9CO0FBQ3ZELE1BQU1DLHNCQUFzQixLQUFLLEtBQUssS0FBSztBQVEzQyxTQUFTQztJQUNQLE9BQU9DLFFBQVFDLEdBQUcsQ0FBQ0MsV0FBVyxJQUFJO0FBQ3BDO0FBRUEsU0FBU0MsWUFBWUMsS0FBYTtJQUNoQyxPQUFPQyxPQUFPQyxJQUFJLENBQUNGLE9BQU8sUUFBUUcsUUFBUSxDQUFDO0FBQzdDO0FBRUEsU0FBU0MsY0FBY0osS0FBYTtJQUNsQyxPQUFPQyxPQUFPQyxJQUFJLENBQUNGLE9BQU8sYUFBYUcsUUFBUSxDQUFDO0FBQ2xEO0FBRUEsU0FBU0UsS0FBS0MsVUFBa0I7SUFDOUIsT0FBT2YsdURBQVVBLENBQUMsVUFBVUksYUFBYVksTUFBTSxDQUFDRCxZQUFZRSxNQUFNLENBQUM7QUFDckU7QUFFTyxTQUFTQyxtQkFBbUJDLEtBQWEsRUFBRUMsSUFBc0I7SUFDdEUsTUFBTUMsTUFBTUMsS0FBS0MsS0FBSyxDQUFDQyxLQUFLQyxHQUFHLEtBQUssUUFBUXRCO0lBQzVDLE1BQU11QixVQUEwQjtRQUFFUCxPQUFPQSxNQUFNUSxXQUFXO1FBQUlQO1FBQU1DO0lBQUk7SUFDeEUsTUFBTU4sYUFBYVAsWUFBWW9CLEtBQUtDLFNBQVMsQ0FBQ0g7SUFDOUMsTUFBTUksTUFBTWhCLEtBQUtDO0lBQ2pCLE9BQU8sR0FBR0EsV0FBVyxDQUFDLEVBQUVlLEtBQUs7QUFDL0I7QUFFTyxTQUFTQyxtQkFBbUJDLEtBQWE7SUFDOUMsTUFBTSxDQUFDakIsWUFBWWUsSUFBSSxHQUFHRSxNQUFNQyxLQUFLLENBQUM7SUFDdEMsSUFBSSxDQUFDbEIsY0FBYyxDQUFDZSxLQUFLO1FBQ3ZCLE9BQU87SUFDVDtJQUVBLE1BQU1JLFdBQVdwQixLQUFLQztJQUN0QixNQUFNb0IsU0FBU3pCLE9BQU9DLElBQUksQ0FBQ21CO0lBQzNCLE1BQU1NLGNBQWMxQixPQUFPQyxJQUFJLENBQUN1QjtJQUNoQyxJQUFJQyxPQUFPRSxNQUFNLEtBQUtELFlBQVlDLE1BQU0sSUFBSSxDQUFDcEMsNERBQWVBLENBQUNrQyxRQUFRQyxjQUFjO1FBQ2pGLE9BQU87SUFDVDtJQUVBLElBQUk7UUFDRixNQUFNVixVQUFVRSxLQUFLVSxLQUFLLENBQUN6QixjQUFjRTtRQUN6QyxJQUFJLENBQUNXLFNBQVNQLFNBQVMsQ0FBQ08sU0FBU04sUUFBUSxDQUFDTSxTQUFTTCxLQUFLO1lBQ3RELE9BQU87UUFDVDtRQUVBLE1BQU1JLE1BQU1ILEtBQUtDLEtBQUssQ0FBQ0MsS0FBS0MsR0FBRyxLQUFLO1FBQ3BDLElBQUlDLFFBQVFMLEdBQUcsR0FBR0ksS0FBSztZQUNyQixPQUFPO1FBQ1Q7UUFFQSxPQUFPQztJQUNULEVBQUUsT0FBTTtRQUNOLE9BQU87SUFDVDtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXE5CVEMtU1lTSUQtMDAxM1xcRG9jdW1lbnRzXFxEZXZlbG9wbWVudFxcbmV3IFdlYiBzdG9yZVxcbmV3IFdlYiBzdG9yZVxcbmV4dC1zdG9yZVxcbGliXFxzZXJ2ZXJcXGF1dGgtc2Vzc2lvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVIbWFjLCB0aW1pbmdTYWZlRXF1YWwgfSBmcm9tIFwibm9kZTpjcnlwdG9cIjtcclxuXHJcbmV4cG9ydCBjb25zdCBTRVNTSU9OX0NPT0tJRV9OQU1FID0gXCJzaG9wZnJvbnRfc2Vzc2lvblwiO1xyXG5jb25zdCBTRVNTSU9OX1RUTF9TRUNPTkRTID0gNjAgKiA2MCAqIDI0ICogNztcclxuXHJcbnR5cGUgU2Vzc2lvblBheWxvYWQgPSB7XHJcbiAgZW1haWw6IHN0cmluZztcclxuICByb2xlOiBcImFkbWluXCIgfCBcInVzZXJcIjtcclxuICBleHA6IG51bWJlcjtcclxufTtcclxuXHJcbmZ1bmN0aW9uIGdldFNlY3JldCgpOiBzdHJpbmcge1xyXG4gIHJldHVybiBwcm9jZXNzLmVudi5BVVRIX1NFQ1JFVCB8fCBcImRldi1vbmx5LWNoYW5nZS1tZVwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0b0Jhc2U2NFVybChpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gQnVmZmVyLmZyb20oaW5wdXQsIFwidXRmOFwiKS50b1N0cmluZyhcImJhc2U2NHVybFwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZnJvbUJhc2U2NFVybChpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gQnVmZmVyLmZyb20oaW5wdXQsIFwiYmFzZTY0dXJsXCIpLnRvU3RyaW5nKFwidXRmOFwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2lnbihwYXlsb2FkQjY0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiBjcmVhdGVIbWFjKFwic2hhMjU2XCIsIGdldFNlY3JldCgpKS51cGRhdGUocGF5bG9hZEI2NCkuZGlnZXN0KFwiYmFzZTY0dXJsXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2Vzc2lvblRva2VuKGVtYWlsOiBzdHJpbmcsIHJvbGU6IFwiYWRtaW5cIiB8IFwidXNlclwiKTogc3RyaW5nIHtcclxuICBjb25zdCBleHAgPSBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKSArIFNFU1NJT05fVFRMX1NFQ09ORFM7XHJcbiAgY29uc3QgcGF5bG9hZDogU2Vzc2lvblBheWxvYWQgPSB7IGVtYWlsOiBlbWFpbC50b0xvd2VyQ2FzZSgpLCByb2xlLCBleHAgfTtcclxuICBjb25zdCBwYXlsb2FkQjY0ID0gdG9CYXNlNjRVcmwoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpO1xyXG4gIGNvbnN0IHNpZyA9IHNpZ24ocGF5bG9hZEI2NCk7XHJcbiAgcmV0dXJuIGAke3BheWxvYWRCNjR9LiR7c2lnfWA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlTZXNzaW9uVG9rZW4odG9rZW46IHN0cmluZyk6IFNlc3Npb25QYXlsb2FkIHwgbnVsbCB7XHJcbiAgY29uc3QgW3BheWxvYWRCNjQsIHNpZ10gPSB0b2tlbi5zcGxpdChcIi5cIik7XHJcbiAgaWYgKCFwYXlsb2FkQjY0IHx8ICFzaWcpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZXhwZWN0ZWQgPSBzaWduKHBheWxvYWRCNjQpO1xyXG4gIGNvbnN0IHNpZ0J1ZiA9IEJ1ZmZlci5mcm9tKHNpZyk7XHJcbiAgY29uc3QgZXhwZWN0ZWRCdWYgPSBCdWZmZXIuZnJvbShleHBlY3RlZCk7XHJcbiAgaWYgKHNpZ0J1Zi5sZW5ndGggIT09IGV4cGVjdGVkQnVmLmxlbmd0aCB8fCAhdGltaW5nU2FmZUVxdWFsKHNpZ0J1ZiwgZXhwZWN0ZWRCdWYpKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBwYXlsb2FkID0gSlNPTi5wYXJzZShmcm9tQmFzZTY0VXJsKHBheWxvYWRCNjQpKSBhcyBTZXNzaW9uUGF5bG9hZDtcclxuICAgIGlmICghcGF5bG9hZD8uZW1haWwgfHwgIXBheWxvYWQ/LnJvbGUgfHwgIXBheWxvYWQ/LmV4cCkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBub3cgPSBNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKTtcclxuICAgIGlmIChwYXlsb2FkLmV4cCA8IG5vdykge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGF5bG9hZDtcclxuICB9IGNhdGNoIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiY3JlYXRlSG1hYyIsInRpbWluZ1NhZmVFcXVhbCIsIlNFU1NJT05fQ09PS0lFX05BTUUiLCJTRVNTSU9OX1RUTF9TRUNPTkRTIiwiZ2V0U2VjcmV0IiwicHJvY2VzcyIsImVudiIsIkFVVEhfU0VDUkVUIiwidG9CYXNlNjRVcmwiLCJpbnB1dCIsIkJ1ZmZlciIsImZyb20iLCJ0b1N0cmluZyIsImZyb21CYXNlNjRVcmwiLCJzaWduIiwicGF5bG9hZEI2NCIsInVwZGF0ZSIsImRpZ2VzdCIsImNyZWF0ZVNlc3Npb25Ub2tlbiIsImVtYWlsIiwicm9sZSIsImV4cCIsIk1hdGgiLCJmbG9vciIsIkRhdGUiLCJub3ciLCJwYXlsb2FkIiwidG9Mb3dlckNhc2UiLCJKU09OIiwic3RyaW5naWZ5Iiwic2lnIiwidmVyaWZ5U2Vzc2lvblRva2VuIiwidG9rZW4iLCJzcGxpdCIsImV4cGVjdGVkIiwic2lnQnVmIiwiZXhwZWN0ZWRCdWYiLCJsZW5ndGgiLCJwYXJzZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/server/auth-session.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fsession%2Froute&page=%2Fapi%2Fauth%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsession%2Froute.ts&appDir=C%3A%5CUsers%5CNBTC-SYSID-0013%5CDocuments%5CDevelopment%5Cnew%20Web%20store%5Cnew%20Web%20store%5Cnext-store%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CNBTC-SYSID-0013%5CDocuments%5CDevelopment%5Cnew%20Web%20store%5Cnew%20Web%20store%5Cnext-store&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fsession%2Froute&page=%2Fapi%2Fauth%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsession%2Froute.ts&appDir=C%3A%5CUsers%5CNBTC-SYSID-0013%5CDocuments%5CDevelopment%5Cnew%20Web%20store%5Cnew%20Web%20store%5Cnext-store%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CNBTC-SYSID-0013%5CDocuments%5CDevelopment%5Cnew%20Web%20store%5Cnew%20Web%20store%5Cnext-store&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_NBTC_SYSID_0013_Documents_Development_new_Web_store_new_Web_store_next_store_app_api_auth_session_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/session/route.ts */ \"(rsc)/./app/api/auth/session/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/session/route\",\n        pathname: \"/api/auth/session\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/session/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\NBTC-SYSID-0013\\\\Documents\\\\Development\\\\new Web store\\\\new Web store\\\\next-store\\\\app\\\\api\\\\auth\\\\session\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_NBTC_SYSID_0013_Documents_Development_new_Web_store_new_Web_store_next_store_app_api_auth_session_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGc2Vzc2lvbiUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGYXV0aCUyRnNlc3Npb24lMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZhdXRoJTJGc2Vzc2lvbiUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNOQlRDLVNZU0lELTAwMTMlNUNEb2N1bWVudHMlNUNEZXZlbG9wbWVudCU1Q25ldyUyMFdlYiUyMHN0b3JlJTVDbmV3JTIwV2ViJTIwc3RvcmUlNUNuZXh0LXN0b3JlJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNOQlRDLVNZU0lELTAwMTMlNUNEb2N1bWVudHMlNUNEZXZlbG9wbWVudCU1Q25ldyUyMFdlYiUyMHN0b3JlJTVDbmV3JTIwV2ViJTIwc3RvcmUlNUNuZXh0LXN0b3JlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUMrRTtBQUM1SjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcTkJUQy1TWVNJRC0wMDEzXFxcXERvY3VtZW50c1xcXFxEZXZlbG9wbWVudFxcXFxuZXcgV2ViIHN0b3JlXFxcXG5ldyBXZWIgc3RvcmVcXFxcbmV4dC1zdG9yZVxcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcc2Vzc2lvblxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9zZXNzaW9uL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9zZXNzaW9uXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL3Nlc3Npb24vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFxVc2Vyc1xcXFxOQlRDLVNZU0lELTAwMTNcXFxcRG9jdW1lbnRzXFxcXERldmVsb3BtZW50XFxcXG5ldyBXZWIgc3RvcmVcXFxcbmV3IFdlYiBzdG9yZVxcXFxuZXh0LXN0b3JlXFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxzZXNzaW9uXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fsession%2Froute&page=%2Fapi%2Fauth%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsession%2Froute.ts&appDir=C%3A%5CUsers%5CNBTC-SYSID-0013%5CDocuments%5CDevelopment%5Cnew%20Web%20store%5Cnew%20Web%20store%5Cnext-store%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CNBTC-SYSID-0013%5CDocuments%5CDevelopment%5Cnew%20Web%20store%5Cnew%20Web%20store%5Cnext-store&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:crypto");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@opentelemetry"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fsession%2Froute&page=%2Fapi%2Fauth%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsession%2Froute.ts&appDir=C%3A%5CUsers%5CNBTC-SYSID-0013%5CDocuments%5CDevelopment%5Cnew%20Web%20store%5Cnew%20Web%20store%5Cnext-store%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CNBTC-SYSID-0013%5CDocuments%5CDevelopment%5Cnew%20Web%20store%5Cnew%20Web%20store%5Cnext-store&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();
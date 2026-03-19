let _token = null

export const getSessionToken = () => _token
export const setSessionToken = (t) => { _token = t }       // Phase 2: + localStorage.setItem
export const clearSessionToken = () => { _token = null }   // Phase 2: + localStorage.removeItem

const crypto = require('crypto');

const COOKIE_NAME = 'mw_guest_id';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// Если у пользователя ещё нет гостевого id — создаём и ставим cookie.
// Если есть — просто прокидываем его дальше в req.guestId.
// Никакой регистрации/пароля: id живёт в httpOnly cookie на год.
function guestAuth(req, res, next) {
  let guestId = req.cookies[COOKIE_NAME];

  if (!guestId) {
    guestId = crypto.randomUUID();
    res.cookie(COOKIE_NAME, guestId, {
      maxAge: ONE_YEAR_MS,
      httpOnly: true,
      sameSite: 'lax',
      // secure: true нужно включить, когда сайт будет на https в проде
    });
  }

  req.guestId = guestId;
  next();
}

module.exports = { guestAuth, COOKIE_NAME };

// import passport from 'passport';
// import PassportLocal from 'passport-local';
// import { User, Token } from 'src/models';
// import { sendVerificationEmail } from 'src/mailer';

// export default () => {
//   const LocalStrategy = PassportLocal.Strategy;

//   passport.serializeUser((user, done) => {
//     done(null, {
//       id: user._id,
//       name: user.local.username,
//       avatar: '',
//       verified: user.local.verified,
//     });
//   });

//   passport.deserializeUser((user, done) => {
//     User.findById(user.id)
//       .then(u => done(null, u))
//       .catch(err => done(err, false));
//   });

//   passport.use(
//     'local-signup',
//     new LocalStrategy(
//       {
//         usernameField: 'username',
//         passwordField: 'password',
//         passReqToCallback: true,
//       },
//       (req, username, password, done) => {
//         User.findOne({ 'local.username': username })
//           .then(user => {
//             if (user) {
//               return done({ message: 'User already exists.' }, false);
//             }
//             const newUser = new User();
//             newUser.local.username = username;
//             newUser.local.email = req.body.email;
//             newUser.local.password = newUser.generateHash(password);
//             newUser
//               .save()
//               .then(() => {
//                 Token.new(newUser._id, 'USER')
//                   .then(token => {
//                     sendVerificationEmail(newUser.local.email, token.token)
//                       .then(() => done(null, newUser))
//                       .catch(emailError => done(emailError, false));
//                   })
//                   .catch(tokenError => done(tokenError, false));
//               })
//               .catch(saveError => done(saveError, false));
//           })
//           .catch(error => done(error));
//       }
//     )
//   );

//   passport.use(
//     'local-login',
//     new LocalStrategy(
//       {
//         usernameField: 'username',
//         passwordField: 'password',
//         passReqToCallback: true,
//       },
//       (_, username, password, done) => {
//         User.findOne({ 'local.username': username })
//           .then(user => {
//             if (!user || !user.validPassword(password)) {
//               done(
//                 {
//                   message: `Having trouble logging you in given the username: ${username}`,
//                 },
//                 false
//               );
//             }
//             done(null, user);
//           })
//           .catch(error => done(error, false));
//       }
//     )
//   );
// };

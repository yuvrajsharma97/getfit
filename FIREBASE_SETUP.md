# 🔥 Firebase Setup & Rules Deployment

## Issue: "Missing or insufficient permissions"

This error occurs when Firestore security rules aren't deployed or configured correctly.

## Solution: Deploy Firestore Rules

### Option 1: Firebase Console (Recommended for Quick Fix)

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Select your project

2. **Navigate to Firestore Database**
   - Click "Firestore Database" in left sidebar
   - Click "Rules" tab at the top

3. **Copy and Paste These Rules**
   ```javascript
   rules_version = '2';

   service cloud.firestore {
     match /databases/{database}/documents {

       // Helper function to check if user is authenticated
       function isAuthenticated() {
         return request.auth != null;
       }

       // Helper function to check if user owns the resource
       function isOwner(userId) {
         return request.auth.uid == userId;
       }

       // Users collection - users can read/write their own data
       match /users/{userId} {
         allow read: if isAuthenticated() && isOwner(userId);
         allow write: if isAuthenticated() && isOwner(userId);

         // User preferences subcollection
         match /preferences/{document=**} {
           allow read, write: if isAuthenticated() && isOwner(userId);
         }

         // User activity subcollection - ALLOW USERS TO LOG THEIR DAILY ACTIVITY
         match /activity/{activityId} {
           allow read: if isAuthenticated() && isOwner(userId);
           allow create: if isAuthenticated() && isOwner(userId);
           allow update: if isAuthenticated() && isOwner(userId);
           allow delete: if isAuthenticated() && isOwner(userId);
         }

         // User workouts subcollection
         match /workouts/{workoutId} {
           allow read, write: if isAuthenticated() && isOwner(userId);
         }

         // User routines subcollection (workout programs)
         match /routines/{routineId} {
           allow read: if isAuthenticated() && isOwner(userId);
           allow create: if isAuthenticated() && isOwner(userId);
           allow update: if isAuthenticated() && isOwner(userId);
           allow delete: if isAuthenticated() && isOwner(userId);
         }

         // User progress subcollection
         match /progress/{progressId} {
           allow read, write: if isAuthenticated() && isOwner(userId);
         }

         // User workout sessions subcollection
         match /workoutSessions/{sessionId} {
           allow read: if isAuthenticated() && isOwner(userId);
           allow create: if isAuthenticated() && isOwner(userId);
           allow update: if isAuthenticated() && isOwner(userId);
           allow delete: if isAuthenticated() && isOwner(userId);
         }
       }

       // Deny all other requests by default
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```

4. **Click "Publish"**
   - Review the changes
   - Click "Publish" button
   - Wait for confirmation message

5. **Test Again**
   - Go back to your app
   - Try generating dummy data again

### Option 2: Firebase CLI (For Production)

1. **Install Firebase CLI** (if not installed)
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if not done)
   ```bash
   firebase init firestore
   ```
   - Select your project
   - Accept default files (firestore.rules)

4. **Deploy Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Verify Deployment**
   ```bash
   firebase firestore:rules:get
   ```

## Verify Your Setup

### Check Authentication
1. Open browser console (F12)
2. Run this command:
   ```javascript
   firebase.auth().currentUser
   ```
3. You should see your user object with `uid`

### Check Rules are Active
1. Go to Firebase Console
2. Firestore Database → Rules tab
3. Verify rules are published (check timestamp)

### Test Write Permission
Open browser console and test:
```javascript
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from './src/services/firebase';

const userId = auth.currentUser.uid;
const testRef = doc(db, 'users', userId, 'activity', 'test');

await setDoc(testRef, { test: true });
console.log('✅ Write successful!');
```

## Common Issues

### Issue 1: Not Logged In
**Error**: "Missing or insufficient permissions"
**Solution**: Make sure you're logged in before accessing `/dev-tools`

### Issue 2: Wrong User ID
**Error**: Permission denied
**Solution**: Verify you're using the correct Firebase user ID
```javascript
console.log('User ID:', firebase.auth().currentUser.uid);
```

### Issue 3: Rules Not Deployed
**Error**: "Missing or insufficient permissions"
**Solution**: Deploy rules using Firebase Console or CLI (see above)

### Issue 4: Collection Path Mismatch
**Error**: Permission denied for specific collection
**Solution**: Verify collection names match rules:
- ✅ `users/{uid}/activity/{date}`
- ✅ `users/{uid}/workoutSessions/{id}`
- ❌ `activities/{date}` (wrong - missing users prefix)

## Temporary Development Rules (USE WITH CAUTION)

⚠️ **ONLY FOR LOCAL DEVELOPMENT - NEVER IN PRODUCTION**

If you need to quickly test, you can temporarily use open rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**IMPORTANT**:
- ⚠️ This allows ANY authenticated user to read/write ANY data
- ⚠️ Only use for local testing
- ⚠️ Revert to secure rules before deploying

## Security Best Practices

✅ **DO:**
- Use the production rules from Option 1
- Test rules before deploying
- Verify user ownership in rules
- Check authentication status

❌ **DON'T:**
- Use open rules in production
- Skip authentication checks
- Allow cross-user data access
- Expose sensitive data

## Next Steps

After deploying rules:

1. ✅ Refresh your app
2. ✅ Try generating dummy data again
3. ✅ Check browser console for any new errors
4. ✅ Verify data appears in Firebase Console

## Still Having Issues?

1. **Check Browser Console**
   - Look for specific error messages
   - Note the collection path in error

2. **Verify Firebase Config**
   - Check `.env` file has correct Firebase credentials
   - Ensure Firebase project is selected correctly

3. **Test Authentication**
   - Logout and login again
   - Verify email is verified (if required)

4. **Contact Support**
   - Share the exact error message
   - Include collection path from error
   - Provide screenshot of Firebase Console rules

---

**Most Common Fix**: Just deploy the rules using Firebase Console (Option 1) 🚀

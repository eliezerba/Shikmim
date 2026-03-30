# Shikmim Research Dashboard v8

מערכת דשבורד מחקרית לניתוח נתוני סקר עצי שקמים, פוליגונים ואזורי-על עם ויזואליזציות מתקדמות.

## תכונות

- 🗺️ **מפה אינטראקטיבית** — Palestine Open Maps (6 שכבות היסטוריות) + OSM + לוויין
- 📊 **ניתוח דיאגרמות** — scatter, bar, heatmap, violin, treemap, CDF, Lorenz, radar
- 🔍 **השוואה** — השוואת פוליגונים, קבוצות, אזורי-על עם מדדים וגרפים
- 📋 **ניהול קבוצות** — מיזוג פוליגונים לקבוצות מותאמות עם סטטיסטיקה
- 🌳 **שדרות** — הערכת עצים בשדרות לפי מרווח שתילה
- 💾 **ייצוא** — CSV של כל הנתונים
- 🔄 **עדכון נתונים** — מקומית דרך `updateFromSheets.js`, ואתר GitHub Pages נטען מ-`data.json`

## ארכיטקטורה

```
shikmim/
├── index.html          (7 טאבים — סקירה, פוליגונים, אזורי-על, הדמיות, מתקדם, קבוצות, שדרות, השוואה)
├── app.js              (~1000 שורות — כל הלוגיקה)
├── style.css           (RTL, responsive)
├── data.json           (נתונים — עצים, שדרות, פוליגונים, התפלגות)
├── server.js           (Node.js מקומי בלבד — serve + API /api/update)
├── updateFromSheets.js (סקריפט מקומי — קורא CSV וכותב data.json)
├── .gitignore
└── README.md
```

## התאמה וקבצים

### קבצים להעלאה ל-GitHub Pages:
```
✅ index.html
✅ app.js
✅ style.css
✅ data.json              (snapshot ראשוני של הנתונים)
✅ .gitignore
✅ README.md
```

### קבצים אופציונליים לעבודה מקומית בלבד:
```
server.js
updateFromSheets.js
```

### קבצים שלא להעלות:
```
❌ node_modules/         (if using npm in future)
❌ .env / credentials    (API keys, if added)
❌ **/__pycache__
❌ .DS_Store, Thumbs.db
❌ *.log
```

## הפעלה כאתר מ-GitHub

המערכת יכולה לרוץ כאתר סטטי ישירות מ-GitHub Pages.

1. צור repository והעלה אליו לפחות את הקבצים:
   - `index.html`
   - `app.js`
   - `style.css`
   - `data.json`
2. ב-GitHub: פתח `Settings` → `Pages`.
3. בחר `Deploy from a branch`.
4. בחר את `main` branch ואת תיקיית `/root`.
5. הכתובת תהיה בפורמט `https://USERNAME.github.io/REPO-NAME/`.

בגרסת GitHub Pages האתר נטען מ-`data.json` שנמצא בריפו. אין עדכון שרת-צד בזמן אמת.

## התקנה + הרצה מקומי

### דרך 1: Node.js Server (מומלץ)
```bash
# להתחיל את השרת
node server.js

# אפליקציה תפתח ב-http://localhost:8080
```

צריך Node.js מותקן. אם יש Python כבר, אפשר להריץ:
```bash
python -m http.server 8080
```

## עדכון מגוגל שיט

### דרך 1: עדכון ידני (מומלץ)
1. פתח את הגוגל שיט: https://docs.google.com/spreadsheets/d/1J12Fobe7alnhDUktpC9yWHboAM1loz5C3WQ0mtBhXFA
2. לכל sheet בנפרד:
   - בחר את כל הנתונים (Ctrl+A)
   - **File → Download → Comma-separated values (.csv)**
   - שמור בשם:
     - `trees.csv` (עצים sheet)
     - `avenues.csv` (שדרות sheet)
     - `polygons.csv` (פוליגונים sheet)
     - `distribution.csv` (התפלגות sheet)
3. שים את הCVS בייתר מהפרויקט (Shikmim/')
4. בטרמינל:
   ```bash
   node updateFromSheets.js
   ```
5. רענן את דף הדשבורד בדפדפן

### דרך 2: עדכון דרך כפתור בדשבורד (אם server רץ)
- בחלון הצוף בשמאל המפה → לחץ "עדכון נתונים"
- המערכת תקרא את ה-CSV בLocalhost ותרענן את data.json
- ⚠️ הדרך הזו דורשת שה-CSV files יהיו קיימים

### דרך 3: פרסום ל-GitHub Pages אחרי עדכון
1. הרץ מקומית:
   ```bash
   node updateFromSheets.js
   ```
2. ודא ש-`data.json` עודכן.
3. בצע commit ו-push של `data.json` ל-GitHub.
4. האתר יתעדכן אוטומטית אחרי ה-push.

## ייישום בGitHub / Vercel

### GitHub Pages (סטטי בלבד)
אם רוצה להשתמש בGitHub Pages (ללא עדכון דינמי):
1. העלה את כל הקבצים לrepo
2. בהגדרות Pages — בחר `main` branch
3. גיסביא תישרת ב-`https://username.github.io/repo-name`

⚠️ **הערה**: GitHub Pages לא תומך בNode.js. כפתור העדכון מנוטרל שם בכוונה.

### Vercel (עם API עדכון)
1. `npm init -y` (אם צריך)
2. העלה לVercel — תמכו בNode.js functions
3. בנה API endpoint ב-`/api/update` שקורא לsceript

או — אם רוצה שרת משלך (linode, aws, heroku):
```bash
node server.js
```

## שמות עמודות בגוגל שיט

**עצים sheet:**
- `#`, `היקף`, `גובה`, `קוטר גזע`, `קוטר כתר`, `גבעולים`, `X`, `Y`, `lat`, `lon`, `פוליגון`

**שדרות sheet:**
- `ID`, `width`, `avg_girth`, `avg_height`, `סוג`, `אורך`, `X1`, `Y1`, `X2`, `Y2`, `lat1`, `lon1`, `lat2`, `lon2`, `פוליגון`

**פוליגונים sheet:**
- `Polygon`, `coords`, `latlons`, `שם בעברית`, `שם באנגלית`, `טור E (מאחד)`, `סוג`, `שטח acres`, `עצים בשיט`, `שדרות בשיט`, `סה״כ היקף`, `ממוצע היקף`, `ממוצע חיובי`, `סטיית תקן`, `מינימום`, `מקסימום`, `צפיפות`

**התפלגות sheet:**
- `Girth Range`, `Min`, `Max`, `Count`, `%`

## טיפים

- **search** בחיפוש: סינון בשם/קוד/פוליגון ישוקק מיד
- **filters** בהשוואה: בחר סוג שטח או אזור-על לסינון פוליגונים
- **CSV export**: כל נתוני פוליגונים — פתח בExcel/Sheets
- **סקורה של מפה**: אם פוליגונים לא מצוירים כצורה — בדוק את קואורדינטות vertices

## עדכון נתונים לאורך זמן

אם רוצה שדשבורד יעדכן בעצמו כל X דקות:
1. בקרת משימות (cron / Task Scheduler)
2. כתוב script שקורא ל-`node updateFromSheets.js` בקביעות
3. אחרי כל עדכון בצע push ל-`data.json` החדש

---

**למידע נוסף:** ראה comments בקוד (`app.js`, `server.js`)

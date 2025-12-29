import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Recipe } from './models/Recipe';

dotenv.config();

const seedDatabase = async () => {
  try {
    const forceReseed = process.argv.includes('--force');

    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grandma-recipes';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data if --force flag is used
    if (forceReseed) {
      console.log('Force flag detected - clearing existing data...');
      await Recipe.deleteMany({});
      await User.deleteMany({});
      console.log('Existing data cleared');
    }

    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@user.com' });
    if (!existingAdmin) {
      const admin = new User({
        email: 'admin@user.com',
        fullName: 'סבתא רינה',
        password: 'IAmAdmin19296157#',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created: admin@user.com');
    } else {
      console.log('Admin user already exists');
    }

    // Create sample recipes in Hebrew
    const existingRecipes = await Recipe.countDocuments();
    if (existingRecipes === 0) {
      const sampleRecipes = [
        // קינוחים - Desserts
        {
          title: 'עוגת שוקולד של סבתא',
          category: 'Desserts',
          ingredients: [
            '2 כוסות קמח',
            '1 כוס סוכר',
            '3/4 כוס אבקת קקאו',
            '2 ביצים',
            '1 כוס שמן',
            '1 כוס מים רותחים',
            '1 כפית אבקת אפייה',
            '1 כפית וניל'
          ],
          instructions: [
            'מחממים תנור ל-180 מעלות',
            'מערבבים את כל החומרים היבשים בקערה גדולה',
            'מוסיפים ביצים ושמן ומערבבים היטב',
            'מוסיפים מים רותחים ומערבבים עד לקבלת בלילה חלקה',
            'יוצקים לתבנית משומנת ואופים 35 דקות'
          ],
          prepTime: 50,
          difficulty: 2,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Parve'
        },
        {
          title: 'עוגת גבינה אפויה',
          category: 'Desserts',
          ingredients: [
            '500 גרם גבינת שמנת',
            '1 כוס סוכר',
            '4 ביצים',
            '200 מ"ל שמנת מתוקה',
            '3 כפות קמח',
            '1 כפית וניל',
            'קרם לימון לציפוי'
          ],
          instructions: [
            'מכינים בסיס פירורים מביסקוויטים וחמאה',
            'מערבבים גבינה עם סוכר עד לקבלת קרם חלק',
            'מוסיפים ביצים אחת אחת תוך כדי ערבוב',
            'מוסיפים שמנת, קמח ווניל',
            'יוצקים על הבסיס ואופים ב-160 מעלות שעה וחצי'
          ],
          prepTime: 120,
          difficulty: 3,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Dairy'
        },
        // מרקים - Soups
        {
          title: 'מרק עוף עם קניידלאך',
          category: 'Soups',
          ingredients: [
            '1 עוף שלם',
            '3 גזרים',
            '2 בצלים',
            '3 ענפי סלרי',
            'אגודת פטרוזיליה',
            'אגודת שמיר',
            'מלח ופלפל',
            'כורכום'
          ],
          instructions: [
            'שוטפים העוף ומכניסים לסיר גדול עם מים',
            'מוסיפים את הירקות והתבלינים',
            'מבשלים על אש נמוכה 3 שעות',
            'מסננים ומוציאים את העוף',
            'מגישים עם קניידלאך או אטריות'
          ],
          prepTime: 180,
          difficulty: 3,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Meat'
        },
        {
          title: 'מרק עדשים כתומות',
          category: 'Soups',
          ingredients: [
            '2 כוסות עדשים כתומות',
            '1 בצל גדול',
            '2 גזרים',
            '2 תפוחי אדמה',
            '1 כפית כמון',
            '1/2 כפית כורכום',
            'מלח ופלפל',
            'מיץ לימון'
          ],
          instructions: [
            'מטגנים בצל קצוץ עד להזהבה',
            'מוסיפים גזר ותפוחי אדמה קצוצים',
            'מוסיפים עדשים, תבלינים ומים',
            'מבשלים 30 דקות עד שהעדשים מתרככות',
            'מוסיפים מיץ לימון וטוחנים במידת הצורך'
          ],
          prepTime: 45,
          difficulty: 1,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Parve'
        },
        // מנות ראשונות - Appetizers
        {
          title: 'חומוס ביתי',
          category: 'Appetizers',
          ingredients: [
            '2 כוסות חומוס יבש',
            '1/2 כוס טחינה גולמית',
            '3 שיני שום',
            'מיץ מ-2 לימונים',
            '1/2 כפית כמון',
            'מלח',
            'שמן זית'
          ],
          instructions: [
            'שורים את החומוס במים למשך לילה',
            'מבשלים עד שהחומוס רך מאוד (כ-2 שעות)',
            'טוחנים עם טחינה, שום, לימון ותבלינים',
            'מוסיפים מי בישול לפי הצורך לקבלת מרקם חלק',
            'מגישים עם שמן זית ופטרוזיליה'
          ],
          prepTime: 30,
          difficulty: 2,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Parve'
        },
        {
          title: 'סלט חצילים קלויים',
          category: 'Appetizers',
          ingredients: [
            '3 חצילים גדולים',
            '3 שיני שום',
            '3 כפות טחינה',
            'מיץ לימון',
            'מלח',
            'פטרוזיליה קצוצה'
          ],
          instructions: [
            'צולים את החצילים על להבה עד שהקליפה נשרפת והפנים רך',
            'מקלפים ומסננים את הנוזלים',
            'קוצצים דק עם השום',
            'מערבבים עם טחינה, לימון ומלח',
            'מקשטים בפטרוזיליה'
          ],
          prepTime: 25,
          difficulty: 2,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Parve'
        },
        // מנות עיקריות - Main Dishes
        {
          title: 'שניצל פריך',
          category: 'Main Dishes',
          ingredients: [
            '4 חזות עוף',
            '2 כוסות פירורי לחם',
            '2 ביצים',
            '1 כוס קמח',
            'פפריקה',
            'מלח ופלפל',
            'שמן לטיגון'
          ],
          instructions: [
            'דקים את חזות העוף לפרוסות דקות',
            'מכינים 3 צלחות: קמח, ביצים טרופות, פירורי לחם עם תבלינים',
            'מעבירים כל פרוסה בקמח, ביצה ופירורים',
            'מטגנים בשמן עמוק וחם עד להזהבה',
            'מייבשים על נייר סופג'
          ],
          prepTime: 30,
          difficulty: 1,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Meat'
        },
        {
          title: 'קציצות בשר ברוטב עגבניות',
          category: 'Main Dishes',
          ingredients: [
            '500 גרם בשר טחון',
            '1 בצל מגורד',
            '1/2 כוס פירורי לחם',
            '1 ביצה',
            'פטרוזיליה קצוצה',
            '2 פחיות עגבניות מרוסקות',
            'מלח, פלפל ופפריקה'
          ],
          instructions: [
            'מערבבים בשר עם בצל, פירורים, ביצה ותבלינים',
            'יוצרים קציצות עגולות ומטגנים קלות',
            'מכינים רוטב מהעגבניות עם שום ותבלינים',
            'מניחים הקציצות ברוטב ומבשלים 40 דקות',
            'מגישים עם אורז או פירה'
          ],
          prepTime: 60,
          difficulty: 2,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Meat'
        },
        // סלטים - Salads
        {
          title: 'סלט ירקות ישראלי',
          category: 'Salads',
          ingredients: [
            '4 עגבניות',
            '4 מלפפונים',
            '1 בצל',
            'פטרוזיליה',
            'מיץ לימון',
            'שמן זית',
            'מלח'
          ],
          instructions: [
            'חותכים את הירקות לקוביות קטנות ואחידות',
            'קוצצים פטרוזיליה דק',
            'מערבבים הכל יחד',
            'מתבלים במלח, לימון ושמן זית',
            'מגישים מיד'
          ],
          prepTime: 15,
          difficulty: 1,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Parve'
        },
        {
          title: 'סלט כרוב סגול',
          category: 'Salads',
          ingredients: [
            '1/2 כרוב סגול',
            '2 גזרים',
            '1/4 כוס מיונז',
            '1 כף חומץ',
            '1 כף סוכר',
            'מלח ופלפל'
          ],
          instructions: [
            'מגררים כרוב וגזר דק',
            'מערבבים מיונז, חומץ וסוכר לרוטב',
            'מוסיפים את הרוטב לירקות ומערבבים',
            'נותנים לנוח במקרר שעה לפני ההגשה'
          ],
          prepTime: 20,
          difficulty: 1,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Parve'
        },
        // תוספות - Side Dishes
        {
          title: 'תפוחי אדמה אפויים',
          category: 'Side Dishes',
          ingredients: [
            '1 ק"ג תפוחי אדמה',
            '4 כפות שמן זית',
            '4 שיני שום',
            'רוזמרין טרי',
            'מלח גס',
            'פלפל שחור'
          ],
          instructions: [
            'חותכים תפוחי אדמה לקוביות',
            'מערבבים עם שמן, שום כתוש ותבלינים',
            'מפזרים בתבנית שכבה אחת',
            'אופים ב-200 מעלות 40 דקות עד להזהבה'
          ],
          prepTime: 50,
          difficulty: 1,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Parve'
        },
        {
          title: 'אורז עם שעועית וגזר',
          category: 'Side Dishes',
          ingredients: [
            '2 כוסות אורז',
            '1 פחית שעועית אדומה',
            '2 גזרים מגוררים',
            '1 בצל קצוץ',
            '4 כוסות מים',
            'מלח, כמון וכורכום'
          ],
          instructions: [
            'מטגנים בצל עד להזהבה',
            'מוסיפים גזר ומטגנים 2 דקות',
            'מוסיפים אורז שטוף ומערבבים',
            'מוסיפים מים, שעועית מסוננת ותבלינים',
            'מבשלים על אש נמוכה 20 דקות'
          ],
          prepTime: 35,
          difficulty: 1,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Parve'
        },
        // מאפים - Baked goods
        {
          title: 'חלה ביתית',
          category: 'Baked goods',
          ingredients: [
            '1 ק"ג קמח',
            '1/4 כוס סוכר',
            '2 כפיות שמרים יבשים',
            '2 ביצים',
            '1/3 כוס שמן',
            '1.5 כוסות מים פושרים',
            '1 כפית מלח'
          ],
          instructions: [
            'ממיסים שמרים במים פושרים עם כפית סוכר',
            'מוסיפים קמח, שאר הסוכר, ביצים, שמן ומלח',
            'לשים 10 דקות עד לבצק חלק וגמיש',
            'מתפיחים שעתיים עד להכפלת הנפח',
            'קולעים, מתפיחים עוד 30 דקות ואופים ב-180 מעלות 30 דקות'
          ],
          prepTime: 180,
          difficulty: 3,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Parve'
        },
        {
          title: 'בורקס גבינה',
          category: 'Baked goods',
          ingredients: [
            '500 גרם בצק עלים',
            '300 גרם גבינה בולגרית',
            '200 גרם גבינת קוטג\'',
            '1 ביצה',
            'שמיר קצוץ',
            'ביצה לציפוי',
            'שומשום'
          ],
          instructions: [
            'מערבבים גבינות עם ביצה ושמיר',
            'חותכים בצק עלים למרובעים',
            'ממלאים ומקפלים למשולשים',
            'סוגרים היטב עם מזלג',
            'מורחים ביצה טרופה ומפזרים שומשום',
            'אופים ב-180 מעלות 25 דקות'
          ],
          prepTime: 45,
          difficulty: 2,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Dairy'
        },
        // בריא וטעים - Healthy & Tasty
        {
          title: 'קערת קינואה עם ירקות',
          category: 'Healthy & Tasty',
          ingredients: [
            '1 כוס קינואה',
            '1 פחית חומוס',
            '1 אבוקדו',
            '10 עגבניות שרי',
            '1 מלפפון',
            'רוטב לימון-טחינה',
            'עלי תרד'
          ],
          instructions: [
            'מבשלים קינואה לפי ההוראות ומצננים',
            'חותכים ירקות לקוביות',
            'מסדרים קינואה בקערה',
            'מניחים מעל חומוס, אבוקדו וירקות',
            'מזלפים רוטב לימון-טחינה'
          ],
          prepTime: 25,
          difficulty: 1,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Parve'
        },
        {
          title: 'סלמון בתנור עם ירקות',
          category: 'Healthy & Tasty',
          ingredients: [
            '4 פילה סלמון',
            '2 קישואים',
            '1 פלפל אדום',
            '1 פלפל צהוב',
            'שמן זית',
            'מלח, פלפל ולימון',
            'שמיר טרי'
          ],
          instructions: [
            'מסדרים פילה סלמון בתבנית',
            'מסביב מניחים ירקות חתוכים',
            'מזלפים שמן זית ומתבלים',
            'סוחטים לימון מעל',
            'אופים ב-180 מעלות 25 דקות'
          ],
          prepTime: 35,
          difficulty: 2,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Parve'
        },
        // מתכונים תימניים - Yemeni Recipes
        {
          title: "ג'חנון תימני מסורתי",
          category: 'Baked goods',
          ingredients: [
            '4 כוסות קמח',
            '1 כף סוכר',
            '1 כפית מלח',
            '150 גרם חמאה או מרגרינה',
            '1 כוס מים',
            'סמנה למריחה'
          ],
          instructions: [
            'מכינים בצק מקמח, סוכר, מלח ומים',
            'לשים עד לבצק חלק ומניחים לנוח',
            'מחלקים לכדורים ופורשים דק',
            'מורחים סמנה ומגלגלים לגליל',
            'מניחים בסיר ואופים בתנור על אש נמוכה כל הלילה'
          ],
          prepTime: 480,
          difficulty: 4,
          imageUrl: '',
          isYemeni: true,
          kosherType: 'Parve'
        },
        {
          title: 'מרק תימני (מרק פטמות)',
          category: 'Soups',
          ingredients: [
            '500 גרם בשר כבש או עוף',
            '4 תפוחי אדמה',
            '2 עגבניות',
            '1 כף חוואיג\'',
            '1 כפית כמון',
            '1 כפית כורכום',
            'מלח ופלפל',
            'אגודת כוסברה'
          ],
          instructions: [
            'מטגנים בשר עם בצל ותבלינים',
            'מוסיפים מים ומביאים לרתיחה',
            'מוסיפים תפוחי אדמה ועגבניות',
            'מבשלים על אש נמוכה 2-3 שעות',
            'מגישים עם כוסברה טרייה ולחוח'
          ],
          prepTime: 180,
          difficulty: 2,
          imageUrl: '',
          isYemeni: true,
          kosherType: 'Meat'
        },
        {
          title: "סחוג (זחוג) ירוק",
          category: 'Side Dishes',
          ingredients: [
            'אגודה גדולה כוסברה',
            '5-10 פלפלים חריפים ירוקים',
            '6 שיני שום',
            '1 כפית כמון',
            '1/2 כפית הל',
            '1/4 כוס שמן זית',
            'מלח'
          ],
          instructions: [
            'שוטפים היטב את הכוסברה',
            'טוחנים כוסברה, פלפלים ושום בבלנדר',
            'מוסיפים תבלינים ושמן',
            'טוחנים עד לקבלת מרקם אחיד',
            'שומרים במקרר בצנצנת סגורה'
          ],
          prepTime: 10,
          difficulty: 1,
          imageUrl: '',
          isYemeni: true,
          kosherType: 'Parve'
        },
        {
          title: 'לחוח תימני',
          category: 'Baked goods',
          ingredients: [
            '2 כוסות קמח',
            '1 כוס סולת',
            '1 כפית שמרים יבשים',
            '1 כפית סוכר',
            '1/2 כפית מלח',
            '2.5 כוסות מים'
          ],
          instructions: [
            'מערבבים קמח, סולת, שמרים, סוכר ומלח',
            'מוסיפים מים בהדרגה עד לבלילה נוזלית',
            'מכסים ומתפיחים שעה',
            'יוצקים שכבה דקה על מחבת חמה',
            'אופים צד אחד בלבד עד שהלחוח מחורר מלמעלה'
          ],
          prepTime: 90,
          difficulty: 3,
          imageUrl: '',
          isYemeni: true,
          kosherType: 'Parve'
        },
        {
          title: 'מלווח תימני',
          category: 'Baked goods',
          ingredients: [
            '3 כוסות קמח',
            '1 כפית מלח',
            '1 כף סוכר',
            '1 כוס מים פושרים',
            '200 גרם חמאה או מרגרינה רכה'
          ],
          instructions: [
            'לשים בצק מקמח, מלח, סוכר ומים',
            'מחלקים ל-6 כדורים ומניחים לנוח',
            'פורשים כל כדור דק ומורחים חמאה',
            'מקפלים כמניפה ואז לריבוע',
            'מטגנים על מחבת יבשה משני הצדדים'
          ],
          prepTime: 60,
          difficulty: 3,
          imageUrl: '',
          isYemeni: true,
          kosherType: 'Parve'
        },
        // ארוחות בוקר - Breakfast
        {
          title: 'שקשוקה',
          category: 'Breakfast',
          ingredients: [
            '6 ביצים',
            '1 פחית עגבניות מרוסקות',
            '1 פלפל אדום',
            '1 בצל',
            '3 שיני שום',
            'פפריקה מתוקה',
            'כמון',
            'פטרוזיליה'
          ],
          instructions: [
            'מטגנים בצל ופלפל עד לריכוך',
            'מוסיפים שום ותבלינים ומטגנים דקה',
            'מוסיפים עגבניות ומבשלים 10 דקות',
            'יוצרים גומות ושוברים לתוכן ביצים',
            'מכסים ומבשלים עד שהביצים מוכנות',
            'מפזרים פטרוזיליה ומגישים עם לחם'
          ],
          prepTime: 25,
          difficulty: 1,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Parve'
        },
        {
          title: 'לביבות גבינה',
          category: 'Breakfast',
          ingredients: [
            '500 גרם גבינת קוטג\'',
            '2 ביצים',
            '4 כפות קמח',
            '2 כפות סוכר',
            'קורט מלח',
            'שמן לטיגון'
          ],
          instructions: [
            'מערבבים גבינה עם ביצים',
            'מוסיפים קמח, סוכר ומלח',
            'יוצרים לביבות קטנות',
            'מטגנים בשמן עד להזהבה משני הצדדים',
            'מגישים עם שמנת חמוצה או ריבה'
          ],
          prepTime: 20,
          difficulty: 1,
          imageUrl: '',
          isYemeni: false,
          kosherType: 'Dairy'
        }
      ];

      await Recipe.insertMany(sampleRecipes);
      console.log('נוצרו מתכונים לדוגמה');
    } else {
      console.log('מתכונים כבר קיימים במסד הנתונים');
    }

    console.log('הזרעת מסד הנתונים הושלמה בהצלחה');
    process.exit(0);
  } catch (error) {
    console.error('שגיאה בהזרעת מסד הנתונים:', error);
    process.exit(1);
  }
};

seedDatabase();

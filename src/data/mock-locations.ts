export const wilayas = [
  { code: '16', name: 'Algiers', nameAr: 'الجزائر' },
  { code: '31', name: 'Oran', nameAr: 'وهران' },
  { code: '25', name: 'Constantine', nameAr: 'قسنطينة' },
]

export const municipalities: Record<string, { id: string; name: string; nameAr: string }[]> = {
  '16': [ // Algiers
    { id: '1601', name: 'Algiers Centre', nameAr: 'الجزائر الوسطى' },
    { id: '1602', name: 'Sidi M\'Hamed', nameAr: 'سيدي امحمد' },
    { id: '1603', name: 'El Madania', nameAr: 'المدنية' },
    { id: '1604', name: 'Belouizdad', nameAr: 'بلوزداد' },
    { id: '1605', name: 'Bab El Oued', nameAr: 'باب الواد' },
    { id: '1611', name: 'Bouzareah', nameAr: 'بوزريعة' },
  ],
  '31': [ // Oran
    { id: '3101', name: 'Oran', nameAr: 'وهران' },
    { id: '3102', name: 'Bir El Djir', nameAr: 'بئر الجير' },
    { id: '3103', name: 'Es Senia', nameAr: 'السانية' },
  ],
  '25': [ // Constantine
    { id: '2501', name: 'Constantine', nameAr: 'قسنطينة' },
    { id: '2502', name: 'El Khroub', nameAr: 'الخروب' },
    { id: '2503', name: 'Ain Smara', nameAr: 'عين سمارة' },
  ]
}

export const institutions: Record<string, { id: string; name: string; nameAr: string }[]> = {
  '1601': [
    { id: 'inst_1', name: 'CEM Emir Abdelkader', nameAr: 'متوسطة الأمير عبد القادر' },
    { id: 'inst_2', name: 'Lycée Okba', nameAr: 'ثانوية عقبة' },
  ],
  '1611': [
    { id: 'inst_3', name: 'CEM Bouzareah', nameAr: 'متوسطة بوزريعة' },
  ],
  '3101': [
    { id: 'inst_4', name: 'Lycée Lotfi', nameAr: 'ثانوية لطفي' },
  ],
  '2501': [
    { id: 'inst_5', name: 'Technicum', nameAr: 'متقن قسنطينة' },
  ]
}

export const subjectsList = [
  { id: 'math', name: 'Mathematics', nameAr: 'الرياضيات' },
  { id: 'physics', name: 'Physics', nameAr: 'الفيزياء' },
  { id: 'science', name: 'Science', nameAr: 'العلوم الطبيعية' },
  { id: 'arabic', name: 'Arabic', nameAr: 'اللغة العربية' },
  { id: 'french', name: 'French', nameAr: 'اللغة الفرنسية' },
  { id: 'english', name: 'English', nameAr: 'اللغة الإنجليزية' },
  { id: 'history', name: 'History & Geography', nameAr: 'التاريخ والجغرافيا' },
  { id: 'islamic', name: 'Islamic Education', nameAr: 'التربية الإسلامية' },
]

export const classesList = [
  // Middle School
  { id: '1AM', name: '1AM' },
  { id: '2AM', name: '2AM' },
  { id: '3AM', name: '3AM' },
  { id: '4AM', name: '4AM' },
  // High School
  { id: '1AS', name: '1AS' },
  { id: '2AS', name: '2AS' },
  { id: '3AS', name: '3AS' },
]

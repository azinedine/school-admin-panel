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
  // Algiers
  '1601': [
    { id: 'inst_1601_1', name: 'CEM Emir Abdelkader', nameAr: 'متوسطة الأمير عبد القادر' },
    { id: 'inst_1601_2', name: 'Lycée Okba', nameAr: 'ثانوية عقبة' },
  ],
  '1602': [{ id: 'inst_1602_1', name: 'CEM Sidi M\'Hamed', nameAr: 'متوسطة سيدي امحمد' }],
  '1603': [{ id: 'inst_1603_1', name: 'CEM El Madania', nameAr: 'متوسطة المدنية' }],
  '1604': [{ id: 'inst_1604_1', name: 'Lycée Belouizdad', nameAr: 'ثانوية بلوزداد' }],
  '1605': [{ id: 'inst_1605_1', name: 'CEM Bab El Oued', nameAr: 'متوسطة باب الواد' }],
  '1611': [{ id: 'inst_1611_1', name: 'CEM Bouzareah', nameAr: 'متوسطة بوزريعة' }],
  
  // Oran
  '3101': [{ id: 'inst_3101_1', name: 'Lycée Lotfi', nameAr: 'ثانوية لطفي' }],
  '3102': [{ id: 'inst_3102_1', name: 'Lycée Bir El Djir', nameAr: 'ثانوية بئر الجير' }],
  '3103': [{ id: 'inst_3103_1', name: 'Technicum Es Senia', nameAr: 'متقن السانية' }],

  // Constantine
  '2501': [{ id: 'inst_2501_1', name: 'Technicum Constantine', nameAr: 'متقن قسنطينة' }],
  '2502': [{ id: 'inst_2502_1', name: 'Lycée El Khroub', nameAr: 'ثانوية الخروب' }],
  '2503': [{ id: 'inst_2503_1', name: 'CEM Ain Smara', nameAr: 'متوسطة عين سمارة' }],
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
  { id: 'drawing', name: 'Drawing / Art', nameAr: 'التربية التشكيلية' },
  { id: 'cs', name: 'Computer Science', nameAr: 'الإعلام الآلي' },
  { id: 'civic', name: 'Civic Education', nameAr: 'التربية المدنية' },
]

export const classesList = [
  // Middle School
  { id: '1AM', name: '1AM' },
  { id: '2AM', name: '2AM' },
  { id: '3AM', name: '3AM' },
  { id: '4AM', name: '4AM' },
  // // High School
  // { id: '1AS', name: '1AS' },
  // { id: '2AS', name: '2AS' },
  // { id: '3AS', name: '3AS' },
]

'use server';

import { faker } from '@faker-js/faker';
import { db } from '../db';
import { Gender, Prisma, Program } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getRandElement } from '../utils';
import { getNextPeriod } from './period.actions';

export const generateSkills = async () => {
  try {
    const skills = db.skill.createMany({
      data: [
        {
          name: 'Kotlin',
        },
        {
          name: 'React',
        },
        {
          name: 'TypeScript',
        },
        {
          name: 'Next.js',
        },
        {
          name: 'React Native',
        },
      ],
      skipDuplicates: true,
    });
    return skills;
  } catch (error: any) {
    throw new Error(`Failed to generate skills: ${error.message}`);
  }
};

export const generateCoupons = async () => {
  try {
    const coupons = await db.coupon.createMany({
      data: [
        {
          name: faker.company.name(),
          email: faker.internet.email(),
          phoneNumber: faker.phone.number(),
          code: `${Date.now()}`,
          expiredAt: faker.date.future(),
        },
      ],
      skipDuplicates: true,
    });
    return coupons;
  } catch (error: any) {
    throw new Error(`Failed to generate coupons: ${error.message}`);
  }
};

export const generateCategories = async () => {
  try {
    await db.category.deleteMany();
    return await db.category.createMany({
      data: [
        {
          name: 'Voyager',
          ageDescription: '7-10 Tahun',
        },
        {
          name: 'Analizer',
          ageDescription: '10-14 Tahun',
        },
        {
          name: 'Journeyer',
          ageDescription: '12-17 Tahun',
        },
        {
          name: 'Creators',
          ageDescription: '15-17 Tahun',
        },
      ],
    });
  } catch (error: any) {
    throw new Error(`Failed to generate categories: ${error.message}`);
  }
};

export const generateHero = async () => {
  try {
    await db.hero.deleteMany();
    return await db.hero.create({
      data: {
        title: 'Bangun Potensi Kreativitas Anak-anak Lewat Codings',
        subtitle:
          'Membantu mengembangkan Kreativitas, Karakter, dan Pemikiran Logis Anak-anak Melalui Kursus Coding',
        image:
          'https://res.cloudinary.com/dgtch1ffs/image/upload/v1696243224/yoxqefb9hlos7itwmwtz.png',
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to generate hero: ${error.message}`);
  }
};

export const generateFaq = async () => {
  try {
    await db.faq.deleteMany();
    return await db.faq.createMany({
      data: [
        {
          question:
            'Apa yang membuat Lecturna berbeda dari kursus koding lainnya?',
          answer:
            'Lecturna mengajarkan konsep dasar koding melalui aktivitas yang menyenangkan seperti game, tantangan, proyek kreatif dan mengajarkan nilai-nilai karakter yang dapat diimplementasikan dalam kehidupan sehari-hari melalui pembelajaran coding.',
        },
        {
          question:
            'Apakah kursus koding Lecturna cocok untuk anak-anak usia berapa?',
          answer:
            'Kursus koding Lecturna ditujukan untuk anak-anak usia 7 hingga 17 tahun, memberikan mereka keunggulan awal dalam proyek koding masa depan mereka.',
        },
        {
          question: 'Apa yang dijadikan fokus dalam kursus koding Lecturna?',
          answer:
            'Kursus koding Lecturna fokus pada pembuatan website, pengembangan aplikasi mobile, dan pengembangan game.',
        },
        {
          question:
            'Apakah diperlukan pengetahuan koding sebelumnya untuk mengikuti kursus Lecturna?',
          answer:
            'Tidak, kursus koding Lecturna dirancang untuk semua tingkatan pemula. Kami menyediakan pembelajaran yang disesuaikan dengan level pemahaman anak-anak, sehingga tidak diperlukan pengetahuan koding sebelumnya.',
        },
      ],
    });
  } catch (error: any) {
    throw new Error(`Failed to generate FAQ: ${error.message}`);
  }
};

export const generateLogo = async () => {
  try {
    await db.logo.deleteMany();
    return await db.logo.create({
      data: {
        image:
          'https://res.cloudinary.com/dgtch1ffs/image/upload/v1696243248/fx7rxn5qmwes2cs02qo3.webp',
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to generate logo: ${error.message}`);
  }
};

export const generateMasterDay = async () => {
  try {
    await db.masterDay.deleteMany();
    return await db.masterDay.createMany({
      data: [
        {
          day: 'SUNDAY',
          position: 0,
        },
        {
          day: 'MONDAY',
          position: 1,
        },
        {
          day: 'TUESDAY',
          position: 2,
        },
        {
          day: 'WEDNESDAY',
          position: 3,
        },
        {
          day: 'THURSDAY',
          position: 4,
        },
        {
          day: 'FRIDAY',
          position: 5,
        },
        {
          day: 'SATURDAY',
          position: 6,
        },
      ],
    });
  } catch (error: any) {
    throw new Error(`Failed to generate master day: ${error.message}`);
  }
};

export const generateShift = async () => {
  try {
    await db.masterShift.deleteMany();
    const shifts = await db.masterShift.createMany({
      data: [
        {
          startTime: '09:00',
          endTime: '10:00',
        },
        {
          startTime: '10:00',
          endTime: '11:00',
        },
        {
          startTime: '11:00',
          endTime: '12:00',
        },
        {
          startTime: '12:00',
          endTime: '13:00',
        },
        {
          startTime: '13:00',
          endTime: '14:00',
        },
        {
          startTime: '14:00',
          endTime: '15:00',
        },
        {
          startTime: '15:00',
          endTime: '16:00',
        },
        {
          startTime: '16:00',
          endTime: '17:00',
        },
        {
          startTime: '17:00',
          endTime: '18:00',
        },
        {
          startTime: '18:00',
          endTime: '19:00',
        },
        {
          startTime: '19:00',
          endTime: '20:00',
        },
      ],
    });
    return shifts;
  } catch (error: any) {
    throw new Error(`Failed to generate shifts: ${error.message}`);
  }
};

export const generatePeriod = async () => {
  try {
    await db.period.deleteMany();
    const periods: Prisma.PeriodUncheckedCreateInput[] = [];
    for (let year = 2023; year <= 2100; year++) {
      periods.push({
        name: `Q1-${year}`,
        startDate: new Date(`${year}-01-01`),
        endDate: new Date(`${year}-03-31`),
      });
      periods.push({
        name: `Q2-${year}`,
        startDate: new Date(`${year}-01-04`),
        endDate: new Date(`${year}-06-30`),
      });
      periods.push({
        name: `Q3-${year}`,
        startDate: new Date(`${year}-07-01`),
        endDate: new Date(`${year}-09-30`),
      });
      periods.push({
        name: `Q4-${year}`,
        startDate: new Date(`${year}-10-01`),
        endDate: new Date(`${year}-12-31`),
      });
    }
    return await db.period.createMany({
      data: periods,
    });
  } catch (error: any) {
    throw new Error(`Failed to generate period: ${error.message}`);
  }
};

export const generateAdmin = async () => {
  try {
    const adminPassword = await bcrypt.hash('admin', 10);
    const admin = await db.account.create({
      data: {
        email: 'admin@gmail.com',
        password: adminPassword,
        name: 'admin',
        phoneNumber: '123123',
        role: 'ADMIN',
        address: 'address123',
        username: 'admin',
        onboarded: true,
        admin: {
          create: {},
        },
      },
    });

    return admin;
  } catch (error: any) {
    throw new Error(`Failed to generate admin: ${error.message}`);
  }
};

export const generatePrograms = async () => {
  try {
    const admin = await db.admin.findFirst();
    const categories = await db.category.findMany();
    const categoryIds = categories.map(({ id }) => id);

    const programs: Program[] = [];
    for (let i = 0; i < 5; i++) {
      const program = await db.program.create({
        data: {
          userId: admin?.id!,
          name: faker.company.name(),
          description: faker.lorem.sentences({
            min: 4,
            max: 5,
          }),
          image: faker.image.url(),
          isPublished: true,
          subtitle: faker.lorem.sentence(),
          courses: {
            createMany: {
              data: [
                {
                  name: faker.company.name(),
                  categoryId: getRandElement(categoryIds),
                  code: faker.company.buzzNoun(),
                  description: faker.lorem.sentences({
                    min: 4,
                    max: 5,
                  }),
                  image: faker.image.url(),
                  isPublished: true,
                  programmingTools: faker.company.buzzPhrase(),
                  level: getRandElement([
                    'BEGINNER',
                    'INTERMEDIATE',
                    'ADVANCED',
                  ]),
                },
                {
                  name: faker.company.name(),
                  categoryId: getRandElement(categoryIds),
                  code: faker.company.buzzNoun(),
                  description: faker.lorem.sentences({
                    min: 4,
                    max: 5,
                  }),
                  image: faker.image.url(),
                  isPublished: true,
                  programmingTools: faker.company.buzzPhrase(),
                  level: getRandElement([
                    'BEGINNER',
                    'INTERMEDIATE',
                    'ADVANCED',
                  ]),
                },
                {
                  name: faker.company.name(),
                  categoryId: getRandElement(categoryIds),
                  code: faker.company.buzzNoun(),
                  description: faker.lorem.sentences({
                    min: 4,
                    max: 5,
                  }),
                  image: faker.image.url(),
                  isPublished: true,
                  programmingTools: faker.company.buzzPhrase(),
                  level: getRandElement([
                    'BEGINNER',
                    'INTERMEDIATE',
                    'ADVANCED',
                  ]),
                },
                {
                  name: faker.company.name(),
                  categoryId: getRandElement(categoryIds),
                  code: faker.company.buzzNoun(),
                  description: faker.lorem.sentences({
                    min: 4,
                    max: 5,
                  }),
                  image: faker.image.url(),
                  isPublished: true,
                  programmingTools: faker.company.buzzPhrase(),
                  level: getRandElement([
                    'BEGINNER',
                    'INTERMEDIATE',
                    'ADVANCED',
                  ]),
                },
                {
                  name: faker.company.name(),
                  categoryId: getRandElement(categoryIds),
                  code: faker.company.buzzNoun(),
                  description: faker.lorem.sentences({
                    min: 4,
                    max: 5,
                  }),
                  image: faker.image.url(),
                  isPublished: true,
                  programmingTools: faker.company.buzzPhrase(),
                  level: getRandElement([
                    'BEGINNER',
                    'INTERMEDIATE',
                    'ADVANCED',
                  ]),
                },
              ],
              skipDuplicates: true,
            },
          },
        },
      });
      programs.push(program);
    }

    return programs;
  } catch (error: any) {
    throw new Error(`Failed to generate program: ${error.message}`);
  }
};

export const generateInstructors = async () => {
  try {
    const hashedPassword = await bcrypt.hash('instructor', 10);
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        program: {
          isPublished: true,
        },
      },
    });

    const courseIds = courses.map(({ id }) => id);

    const nextPeriod = await getNextPeriod();

    const days = await db.masterDay.findMany({
      where: {
        isActive: true,
      },
    });

    const dayIds = days.map(({ id }) => id);

    const shifts = await db.masterShift.findMany({
      where: {
        isActive: true,
      },
    });

    const shiftIds = shifts.map(({ id }) => id);

    const skills = await db.skill.findMany();
    const skillIds = skills.map(({ id }) => id);

    for (let i = 0; i < 10; i++) {
      const instructor = await db.account.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          role: 'INSTRUCTOR',
          address: faker.location.streetAddress(),
          image: faker.image.avatar(),
          onboarded: true,
          password: hashedPassword,
          instructor: {
            create: {
              dateOfBirth: faker.date.birthdate(),
              lastEducation: getRandElement(['S1', 'S2', 'S3']),
              educationInstitution: faker.company.name(),
              instructorCourses: {
                createMany: {
                  data: [
                    {
                      courseId: getRandElement(courseIds),
                      periodId: nextPeriod?.id!,
                    },
                    {
                      courseId: getRandElement(courseIds),
                      periodId: nextPeriod?.id!,
                    },
                    {
                      courseId: getRandElement(courseIds),
                      periodId: nextPeriod?.id!,
                    },
                    {
                      courseId: getRandElement(courseIds),
                      periodId: nextPeriod?.id!,
                    },
                  ],
                  skipDuplicates: true,
                },
              },
              instructorSchedules: {
                createMany: {
                  data: [
                    {
                      dayId: getRandElement(dayIds),
                      periodId: nextPeriod?.id!,
                      shiftId: getRandElement(shiftIds),
                    },
                    {
                      dayId: getRandElement(dayIds),
                      periodId: nextPeriod?.id!,
                      shiftId: getRandElement(shiftIds),
                    },
                    {
                      dayId: getRandElement(dayIds),
                      periodId: nextPeriod?.id!,
                      shiftId: getRandElement(shiftIds),
                    },
                    {
                      dayId: getRandElement(dayIds),
                      periodId: nextPeriod?.id!,
                      shiftId: getRandElement(shiftIds),
                    },
                    {
                      dayId: getRandElement(dayIds),
                      periodId: nextPeriod?.id!,
                      shiftId: getRandElement(shiftIds),
                    },
                    {
                      dayId: getRandElement(dayIds),
                      periodId: nextPeriod?.id!,
                      shiftId: getRandElement(shiftIds),
                    },
                    {
                      dayId: getRandElement(dayIds),
                      periodId: nextPeriod?.id!,
                      shiftId: getRandElement(shiftIds),
                    },
                  ],
                  skipDuplicates: true,
                },
              },
              skills: {
                connect: {
                  id: getRandElement(skillIds),
                },
              },
            },
          },
        },
      });
    }
  } catch (error: any) {
    throw new Error(`Failed to generate instructor: ${error.message}`);
  }
};

export const generateStudents = async () => {
  const date = new Date();
  try {
    const hashedStudentPassword = await bcrypt.hash('student', 10);
    const hashedParentPassword = await bcrypt.hash('parent', 10);

    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        program: {
          isPublished: true,
        },
      },
    });

    const courseIds = courses.map(({ id }) => id);
    const nextPeriod = await getNextPeriod();
    for (let i = 0; i < 1000; i++) {
      await db.account.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          role: 'STUDENT',
          address: faker.location.streetAddress(),
          image: faker.image.avatar(),
          onboarded: true,
          password: hashedStudentPassword,
          student: {
            create: {
              birthPlace: faker.location.city(),
              dateOfBirth: faker.date.birthdate(),
              educationInstitution: faker.company.name(),
              gender: getRandElement(['MALE', 'FEMALE']) as Gender,
              gradeClass: getRandElement(['7', '8', '9', '10', '11', '12']),
              studentId: `${date.getFullYear() % 100}${
                date.getMonth() < 9
                  ? '0' + `${date.getMonth() + 1}`
                  : date.getMonth() + 1
              }${Date.now() % 1000000}`,
              studentCourses: {
                create: {
                  courseId: getRandElement(courseIds),
                  periodId: nextPeriod?.id!,
                  status: 'APPROVED',
                },
              },
              parent: {
                create: {
                  account: {
                    create: {
                      email: faker.internet.email(),
                      name: faker.person.fullName(),
                      role: 'PARENT',
                      onboarded: true,
                      password: hashedParentPassword,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }
  } catch (error: any) {
    throw new Error(`Failed to generate students: ${error.message}`);
  }
};

export const generateTrialClassData = async () => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        program: {
          isPublished: true,
        },
      },
    });

    const courseIds = courses.map(({ id }) => id);
    const data: Prisma.TrialClassRegistrationCreateManyInput[] = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        parentName: faker.person.fullName(),
        childName: faker.person.fullName(),

        birthPlace: faker.location.city(),

        dateOfBirth: faker.date.birthdate(),

        email: faker.internet.email(),
        courseId: getRandElement(courseIds),
        phoneNumber: faker.phone.number(),
        trialClassDate: faker.date.future(),
      });
    }
    await db.trialClassRegistration.createMany({
      data,
      skipDuplicates: true,
    });
  } catch (error: any) {
    throw new Error(`Failed to generate trial class data: ${error.message}`);
  }
};

export const generateCourseRegistrationData = async () => {
  try {
    const coupons = await db.coupon.findMany({
      where: {
        expiredAt: {
          gt: new Date(),
        },
      },
    });
    const couponIds = coupons.map(({ id }) => id);
    const data: Prisma.CourseRegistrationCreateManyInput[] = [];
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        program: {
          isPublished: true,
        },
      },
    });

    const courseIds = courses.map(({ id }) => id);
    for (let i = 0; i < 100; i++) {
      const registrationData = {
        parentName: faker.person.fullName(),
        childName: faker.person.fullName(),

        birthPlace: faker.location.city(),

        dateOfBirth: faker.date.birthdate(),

        childEmail: faker.internet.email(),
        parentEmail: faker.internet.email(),
        courseId: getRandElement(courseIds),
        phoneNumber: faker.phone.number(),
        address: faker.location.streetAddress(),
        childGender: getRandElement(['FEMALE', 'MALE']) as Gender,
        educationInstitution: faker.company.name(),
        gradeClass: getRandElement(['7', '8', '9', '10', '11', '12']),
        couponId: getRandElement(couponIds),
      };
      if (registrationData.childEmail === registrationData.parentEmail) {
        i--;
        continue;
      }
      data.push(registrationData);
    }
    await db.courseRegistration.createMany({
      data,
    });
  } catch (error: any) {
    throw new Error(
      `Failed to generate course registration data: ${error.message}`
    );
  }
};

export const generateInstructorRegistrationData = async () => {
  try {
    const skills = await db.skill.findMany();
    const skillIds = skills.map(({ id }) => id);
    for (let i = 0; i < 100; i++) {
      const data: Prisma.InstructorRegistrationCreateInput = {
        name: faker.person.fullName(),
        lastEducation: 'S1',
        dateOfBirth: faker.date.birthdate(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        address: faker.location.streetAddress(),
        educationInstitution: faker.company.name(),
        skills: {
          connect: {
            id: getRandElement(skillIds),
          },
        },
      };
      await db.instructorRegistration.create({
        data,
      });
    }
  } catch (error: any) {
    throw new Error(
      `Failed to generate course registration data: ${error.message}`
    );
  }
};

export const seedData = async () => {
  try {
    await generateSkills();
    await generateCategories();
    await generateHero();
    await generateFaq();
    await generateLogo();
    await generateAdmin();
    await generateMasterDay();
    await generateShift();
    await generatePeriod();
    await generateCoupons();

    await generatePrograms();
    await generateInstructors();
    await generateStudents();

    await generateTrialClassData();
    await generateCourseRegistrationData();
    await generateInstructorRegistrationData();
  } catch (error: any) {
    throw new Error(`Failed to seed data: ${error.message}`);
  }
};

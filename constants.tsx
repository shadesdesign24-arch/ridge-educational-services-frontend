
import { NavItem, ServiceCardProps, PartnerLogo } from './types';
import logoUrl from './assets/RES-logo2.png';
import logoNightUrl from './assets/RES-logo-night.png';
import successHeroUrl from './assets/res-award.png';
import awardUrl from './assets/inda-res.png';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Partners', href: '#partners' },
];

export const SERVICES: ServiceCardProps[] = [
  {
    icon: 'school',
    title: 'Academic Planning',
    description: 'Personalized roadmaps tailored to your career goals and academic strengths.',
  },
  {
    icon: 'assignment_ind',
    title: 'Admission Assistance',
    description: 'Hassle-free application processing for Engineering, Pharmacy, and Arts colleges.',
  },
  {
    icon: 'payments',
    title: 'Scholarships & Aid',
    description: 'Guiding you through financial aid options and securing available scholarships.',
  },
  {
    icon: 'psychology',
    title: 'College Counseling',
    description: 'One-on-one sessions to help you choose the right institution for your aspirations.',
  },
  {
    icon: 'edit_note',
    title: 'Entrance Exam Support',
    description: 'Preparation tips and material guidance for various competitive entrance tests.',
  },
  {
    icon: 'star',
    title: 'Specialized Needs',
    description: 'Customized support for students with unique requirements or diverse backgrounds.',
  },
];

export const PARTNERS: PartnerLogo[] = [
  {
    name: 'PSG',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCStXj5kUGIzIdAhQ5DdkBuzrnCLEi6DzxkIaQqrrMeJkmI_6uGqoC1xIA7OnEQT2An7_YkzqsjanbrkNUaGOsbbA-gToErWGgHrntEUIazlbudtTlL78KAU13oBQyxLpboukSa7h2JLdAAEbk7cF_v27A_Q8QBLJxCyFGwa7WfTGHqdblQnqUqSu1koD-8L6X0wfBUlu8mZ5MwMxrLeC_o6VeA3mMSOKHEns0dJ3u8ZbCI9p4nLGFekq99GzkJV6RGzxFGkb-SS5o'
  },
  {
    name: 'Karpagam',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDDh6PduRYAe46mXwv1VjECaqq8x7pEKS5qjnb8Nw_SYl5yFfaHSGBhDoP8GjUk0CapiEj75DOofe4GaNKMsIhKoGmfuuwf9JjQomFRj5SBEPUrqUdwZVAlMA2TtwLMOTs59lmbaRxuedgymIGX7bsF4Y6bc3cVU1n8r-TZnUIRS2xJnrD8CEVCnbo_069zbjRUNwLGLgbW00D0V8zXTRA_fgB95D3hCVSonhntukCe1uPK4EZSLVqii67TOMxQJaPyAXCx-3TcNo'
  },
  {
    name: 'RVS',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYyDNmwuOxz9k9CXzc9QxPqiCZ2xcpJ3U2y1cDbBgSMUp4fO_mg2X64L4ZFM_VPasXWFS2AqeJyVpiGRB7vXBwU_SZIyWI0dGWGOERaMMqCMT91OarmFroc2tC-PWGcVLdYCMI_G4vFVSsew_89XeLdrCMBRNMFVUKSGCMZEW9_z0vQgkjK_ngy3x-1-KrrftD2AKHb_KRQkQhM97aTuMVZFY0BYej6HOj0YtIoBtHv_LhwAQWSnfyol6quCRuGYPRtX2_KvtjYJc'
  },
  {
    name: 'Sri Ramakrishna',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjQwENlpMGSf96UVfcpjLO3m8WxnqULg-8lNEK62c4KR4FDrGP2VCSJAv8DTJZ3RH5fqIzAe35xD1JBSqZATjwUSW2UHw665sgPD8_d8jQ6l_yvXcrKQHitV8p-fGM9N1tiTTqmaLYNU_ZqrUrqakfaL5ftFuXcf80tBYCqdbklODmwzDnhSlAsVATlN_bRDULUIV4U1fco3BPKvb92Ya06Tvda5ZssCneS1Smq8jhG9UzgXnXUP7gLQdUlCthEKJ1JsGS_P5lscM'
  },
  {
    name: 'Nehru Group',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYlqZECbu2d10-ZC88TvgTy3PEi18UYwh8W--dnWGFtDAR2-Fa6GI4qu_EdItmsXUE-KNqudn0_eAZEco8U03_2x09HD6N0yZ53SRPBqMjt5bYcfmzBrWikRYZi_hZP8oYoziRTN---zqlqrlADn9CimjIZuIDvBcjePeDnFQM12N0Kg9u0lE19yXN5lEhUWiz-rqMv7bGQWpjkFhA4nwiVo4Ie8ngpXrwvbDE_hsHNbv5lP8t3lhH9qiznzAPKc555qDeCFuAqCM'
  },
  {
    name: 'KCLAS',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDRYiYOWsfP4pcHBOyM2tBXRQDZ00wDRnB7RtvLisGAqeY1rLCtN1K-DsIuke3_cwe2htPpZMvRuGOLAaStojHtWYU__JQc3dviqcE1VR3dAhTkxABZ2y9CvzsBKisxa_Oi391oONRNTfRfQA2tsr8AQT74QRQ1JSTljgBdtwaAFvb_YCwTeEE9KlYFJPxhKr0x85T8QFcHOoeY51UE2zFvvzmw2-xewf7Heie_RgQkXChE6Shdi1c5YFYeBf3bav7vM-TjAmM8BI'
  },
];

export const BASE_URL = 'https://ridgeeducationalservices.com'; // Change to http://ridgeeducationalservices.com in production
export const API_URL = `${BASE_URL}/ridge-backend`;
export const LOGO_URL = logoUrl;
export const LOGO_NIGHT_URL = logoNightUrl;
export const HERO_IMG = successHeroUrl;
export const AWARD_IMG = awardUrl;

import type { Contact, Event, Message, Conversation, User } from '../types';

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: '김도윤',
    title: 'B2B 영업 디렉터',
    company: '주식회사 넥스트',
    phone: '010-1234-5678',
    email: 'doyun.kim@nextcorp.com',
    notes: '해외 출장 예정, 싱글 오리진 아메리카노 선호',
    giftHistory: [
      { name: '프리미엄 원두 세트', price: '150,000원', date: '2023.10.15' }
    ]
  },
  {
    id: '2',
    name: '박서준',
    title: '마케팅 팀장',
    company: '크리에이티브 솔루션',
    phone: '010-8765-4321',
    email: 'seojun.park@creativesol.com',
    giftHistory: [
        { name: '명품 볼펜 세트', price: '300,000원', date: '2023.09.20' }
    ]
  },
  {
    id: '3',
    name: '이하나',
    title: '디자인 총괄',
    company: '디자인 스튜디오',
    phone: '010-5555-8888',
    email: 'hana.lee@design.studio',
    notes: '미니멀리즘 소품을 좋아함. 최근 프로젝트 성공적으로 마침.',
    giftHistory: []
  }
];

export const mockUser: User = {
  name: '박상무',
  title: '상무',
  company: '영업본부',
  phone: '010-1234-5678',
  email: 'park.sangmu@company.com'
};

export const mockEvents: Event[] = [
    { id: '1', title: '팀 회의', date: '2024-09-19', time: '10:00', tag: '회의', tagColor: 'bg-violet-500' },
    { id: '2', title: '프로젝트 마감', date: '2024-09-19', time: '15:00', tag: '업무', tagColor: 'bg-blue-500' },
    { id: '3', title: '점심 약속', date: '2024-09-19', time: '12:30', tag: '개인', tagColor: 'bg-green-500' },
];

export const mockChatHistory: Conversation[] = [
  { 
    id: 'chat1',
    contactId: '1', // 김도윤's ID
    messages: [
      {
        type: 'ai_intro',
        text: `안녕하세요! 김도윤님을 위한 선물을 추천해드릴게요. 예산이나 특별한 상황을 알려주세요.`,
        timestamp: new Date('2023-10-14T10:00:00').getTime()
      },
      {
        type: 'user',
        text: '해외 출장을 앞두고 있는데, 커피를 좋아하셔서 15만원대 선물로 뭐가 좋을까요?',
        timestamp: new Date('2023-10-14T10:01:00').getTime()
      },
      {
        type: 'ai',
        recommendations: [
          {
            name: '프리미엄 원두 세트',
            description: '세계 각국의 희귀한 싱글 오리진 원두를 맛볼 수 있는 특별한 선물입니다.',
            price: '150,000원'
          },
          {
            name: '고급 텀블러',
            description: '보온/보냉 기능이 뛰어난 세련된 디자인의 텀블러입니다.',
            price: '120,000원'
          },
          {
            name: '커피 메이커',
            description: '언제 어디서든 간편하게 신선한 커피를 즐길 수 있는 휴대용 커피 메이커입니다.',
            price: '180,000원'
          }
        ],
        timestamp: new Date('2023-10-14T10:02:00').getTime(),
        selectedGiftName: '프리미엄 원두 세트'
      }
    ]
  },
  {
    id: 'chat2',
    contactId: '2', // 박서준's ID
    messages: [
       {
        type: 'ai_intro',
        text: `안녕하세요! 박서준님을 위한 선물을 추천해드릴게요. 예산이나 특별한 상황을 알려주세요.`,
        timestamp: new Date('2023-09-19T14:00:00').getTime()
      },
      {
        type: 'user',
        text: '승진 축하 선물로 30만원대에서 고급스러운 아이템 추천해주세요.',
        timestamp: new Date('2023-09-19T14:01:00').getTime()
      },
      {
        type: 'ai',
        recommendations: [
            {
                name: '명품 볼펜 세트',
                description: ' 중요한 계약이나 회의에서 사용할 수 있는 품격 있는 선물입니다.',
                price: '300,000원'
            },
            {
                name: '고급 가죽 명함 지갑',
                description: '첫인상을 좌우하는 비즈니스 미팅에서 좋은 인상을 줄 수 있습니다.',
                price: '250,000원'
            },
            {
                name: '프리미엄 위스키',
                description: '성공적인 비즈니스를 축하하며 즐길 수 있는 깊은 풍미의 선물입니다.',
                price: '350,000원'
            }
        ],
        timestamp: new Date('2023-09-19T14:02:00').getTime(),
        selectedGiftName: '명품 볼펜 세트'
      }
    ]
  }
];
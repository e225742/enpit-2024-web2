import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 既存データを削除
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // ユーザーを作成
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      password: 'password123',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      password: 'password456',
    },
  });

  // タグを作成
  const tags = [
    'プログラミングⅠ',
    'プログラミングⅡ',
    '離散数学',
    'アルゴリズムとデータ構造',
    '情報ネットワークⅠ',
    'コンピュータシステム',
    'データサイエンス基礎',
    'プロジェクトデザイン',
    'オペレーティングシステム',
    'コンピュータアーキテクチャ',
    'データベースシステム',
    '人工知能',
    'ディジタル回路',
    '情報ネットワークⅡ',
    '言語理論とオートマトン',
    'ディジタル信号処理',
    '情報理論',
    'ソフトウェア工学',
    '数理計画とアルゴリズム',
    '機械学習',
    '計算機言語構成論',
    '知能ロボット',
    'コレクティブインテリジェンス',
  ];
  await Promise.all(
    tags.map((tagName) =>
      prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      })
    )
  );

  // 質問を作成
  const questions = [
    {
      title: 'プログラミングⅠのループ処理について',
      content: 'ループ処理で無限ループにならないようにするにはどうすれば良いですか？',
      userId: user1.id,
      tags: { connect: [{ name: 'プログラミングⅠ' }] },
    },
    {
      title: '離散数学のド・モルガンの法則について',
      content: 'ド・モルガンの法則の具体的な証明例を教えてください。',
      userId: user1.id,
      tags: { connect: [{ name: '離散数学' }] },
    },
    {
      title: 'アルゴリズムとデータ構造のソートアルゴリズムについて',
      content: 'クイックソートとマージソートの違いを教えてください。',
      userId: user2.id,
      tags: { connect: [{ name: 'アルゴリズムとデータ構造' }] },
    },
    {
      title: 'データベース設計の正規化について',
      content: '正規化の第3正規形を簡単に説明してください。',
      userId: user2.id,
      tags: { connect: [{ name: 'データベースシステム' }] },
    },
    {
      title: '機械学習の教師あり学習について',
      content: '線形回帰とロジスティック回帰の違いは何ですか？',
      userId: user1.id,
      tags: { connect: [{ name: '機械学習' }] },
    },
    {
      title: 'オペレーティングシステムのプロセス管理について',
      content: 'プロセスとスレッドの違いを教えてください。',
      userId: user2.id,
      tags: { connect: [{ name: 'オペレーティングシステム' }] },
    },
    {
      title: '人工知能の探索アルゴリズムについて',
      content: '幅優先探索と深さ優先探索の使い分けを教えてください。',
      userId: user1.id,
      tags: { connect: [{ name: '人工知能' }] },
    },
    {
      title: '情報ネットワークのOSI参照モデルについて',
      content: 'OSI参照モデルの第3層で行われる処理を教えてください。',
      userId: user2.id,
      tags: { connect: [{ name: '情報ネットワークⅠ' }] },
    },
  ];

  await Promise.all(
    questions.map((question) =>
      prisma.question.create({
        data: question,
      })
    )
  );

  // 回答を作成
  const answers = [
    {
      content: '無限ループを避けるには終了条件を明確に設定し、カウンタ変数を使うのがおすすめです。',
      questionId: 1,
      userId: user2.id,
    },
    {
      content: 'ド・モルガンの法則は、否定を取り出す際に積と和を反転させます。具体例は...',
      questionId: 2,
      userId: user2.id,
    },
    {
      content:
        'クイックソートは分割統治法を使い効率が良い場合がありますが、最悪計算量はO(n^2)です。マージソートは安定で常にO(n log n)です。',
      questionId: 3,
      userId: user1.id,
    },
    {
      content: '第3正規形では、主キーに直接関係しない部分的依存を排除し、データの整合性を保ちます。',
      questionId: 4,
      userId: user1.id,
    },
    {
      content: '線形回帰は連続値の予測に使い、ロジスティック回帰は分類問題に用いられます。',
      questionId: 5,
      userId: user2.id,
    },
    {
      content: 'プロセスは独立したリソースを持つ単位で、スレッドはプロセス内で実行される軽量なタスクです。',
      questionId: 6,
      userId: user1.id,
    },
    {
      content: '幅優先探索は最短経路を見つけるのに適しており、深さ優先探索はメモリ使用量が少なくて済む場合に有効です。',
      questionId: 7,
      userId: user2.id,
    },
    {
      content:
        'OSI参照モデルの第3層では、ネットワーク層の役割としてIPアドレスを基にしたルーティングが行われます。',
      questionId: 8,
      userId: user1.id,
    },
  ];

  await prisma.answer.createMany({ data: answers });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

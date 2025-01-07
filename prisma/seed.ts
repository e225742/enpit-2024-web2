import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 既存データを削除
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // ───────── ユーザーを複数作成 (ニックネーム付と無しを混在) ─────────
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      password: 'password123',
      nickname: 'ユーザー1',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      password: 'password456',
      nickname: 'ユーザー2',
    },
  });

  // ランキング表示用にさらに2ユーザー追加
  const user3 = await prisma.user.upsert({
    where: { email: 'user3@example.com' },
    update: {},
    create: {
      email: 'user3@example.com',
      password: 'password789',
      nickname: 'ユーザー3',
    },
  });

  const user4 = await prisma.user.upsert({
    where: { email: 'user4@example.com' },
    update: {},
    create: {
      email: 'user4@example.com',
      password: 'password000',
      // ニックネームなし → 匿名表示の例
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
  // user1, user2 が交互にいくつか投稿
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
      prisma.question.create({ data: question })
    )
  );

  // 回答を作成
  // いろんなユーザーが回答を投稿し、回答数を偏らせてランキングがわかりやすいようにする
  const answers = [
    {
      content: '終了条件を明確に設定し、カウンタを使うのがおすすめです。',
      questionId: 1, // プログラミングⅠ
      userId: user2.id,
    },
    {
      content: 'ド・モルガンの法則は、論理和と論理積を反転させて否定します。例: (A∧B)の否定は...',
      questionId: 2, // 離散数学
      userId: user2.id,
    },
    {
      content:
        'クイックソートは分割統治で最悪O(n^2)ですが平均O(n log n)、マージソートは常にO(n log n)。',
      questionId: 3,
      userId: user1.id,
    },
    {
      content: '第3正規形は主キーに直接関係しない部分的依存を排除し、データの整合性を保ちます。',
      questionId: 4,
      userId: user1.id,
    },
    {
      content: '線形回帰は連続値の予測、ロジスティック回帰は2値分類によく使われます。',
      questionId: 5,
      userId: user2.id,
    },
    {
      content: 'プロセスは独立したリソースを持ち、スレッドはプロセス内の軽量な実行単位です。',
      questionId: 6,
      userId: user1.id,
    },
    {
      content: '幅優先探索は最短経路に向いていて、深さ優先探索はバックトラッキングがしやすいです。',
      questionId: 7,
      userId: user2.id,
    },
    {
      content:
        '第3層（ネットワーク層）ではIPアドレスを使ったルーティングが行われます。',
      questionId: 8,
      userId: user1.id,
    },
    // 追加の回答で user3, user4 にも回答数を加えてみる
    {
      content: 'user3による追加回答1',
      questionId: 1,
      userId: user3.id,
    },
    {
      content: 'user3による追加回答2',
      questionId: 2,
      userId: user3.id,
    },
    {
      content: 'user4が匿名で回答してるかもしれない',
      questionId: 2,
      userId: user4.id,
    },
  ];

  await prisma.answer.createMany({ data: answers });

  console.log('Seeding completed! ユーザー, 質問, 回答, タグの初期設定が完了しました。');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

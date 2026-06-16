import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { clinicName, name, email, phone, interests, otherInterest } = data;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Set up the transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Format interests list
    let interestStr = interests?.join('、 ') || 'なし';
    if (interests?.includes('その他') && otherInterest) {
      interestStr += `\nその他の内容：\n${otherInterest}`;
    }

    // Current date and time in JST
    const now = new Date();
    const jstOptions: Intl.DateTimeFormatOptions = { 
      timeZone: 'Asia/Tokyo', 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    };
    const formatter = new Intl.DateTimeFormat('ja-JP', jstOptions);
    const sentAt = formatter.format(now);

    const mailOptions = {
      from: `"Dental Route" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: '【Dental Route】現状共有フォームが送信されました',
      text: `以下の内容で現状共有フォームが送信されました。

・医院名
${clinicName}

・ご担当者様名
${name}

・メールアドレス
${email}

・電話番号
${phone || '未入力'}

・気になる項目
${interestStr}

・送信日時
${sentAt}
`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

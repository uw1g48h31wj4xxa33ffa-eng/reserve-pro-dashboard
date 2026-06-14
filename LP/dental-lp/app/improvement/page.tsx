"use client";

import React, { useEffect } from 'react';
import './improvement.css';

export default function ImprovementPage() {
  // Simple scroll animation hook
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container header-container">
          <div className="logo">
            <div className="logo-icon">D</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              <span>DentalConnect</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 600 }}>予約導線改善サポート</span>
            </div>
          </div>
          <a href="#contact" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '1rem' }}>無料相談</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <img src="/fv_bg.png" alt="Dental Clinic Background" className="hero-bg" />
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-on-scroll" style={{ opacity: 0 }}>
          <span className="hero-badge">歯科医院向け LINE予約導線改善サポート</span>
          <h1 className="hero-title">
            問い合わせを<br />
            <span>予約につなげる</span>仕組みを
          </h1>
          <p className="hero-subtitle">
            問い合わせから予約確定、掘り起こしまで<br />
            現場に合わせた運用をご提案します
          </p>
          <div className="hero-cta">
            <a href="#contact" className="btn btn-primary">無料相談を予約する</a>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="section pain-points">
        <div className="container">
          <h2 className="section-title animate-on-scroll" style={{ opacity: 0 }}>こんなお悩みありませんか？</h2>
          <div className="pain-grid">
            {[
              "問い合わせは来る、でも予約にならない",
              "無断キャンセルが多い",
              "LINEを活用できていない",
              "過去の患者様の掘り起こしができていない",
              "スタッフの対応が属人化している"
            ].map((text, i) => (
              <div key={i} className="pain-card animate-on-scroll" style={{ opacity: 0, animationDelay: `${i * 0.1}s` }}>
                <span className="pain-icon">✓</span>
                <span className="pain-text">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="section results">
        <div className="container">
          <h2 className="section-title animate-on-scroll" style={{ opacity: 0 }}>圧倒的な改善実績</h2>
          <div className="results-grid">
            <div className="result-card animate-on-scroll" style={{ opacity: 0 }}>
              <div className="result-label">予約確定率</div>
              <div className="result-numbers">
                <span className="before">30%</span>
                <span className="arrow">→</span>
                <span className="after">50%</span>
              </div>
            </div>
            <div className="result-card animate-on-scroll" style={{ opacity: 0, animationDelay: '0.1s' }}>
              <div className="result-label">無断キャンセル</div>
              <div className="result-numbers">
                <span className="before">月平均3件</span>
                <span className="arrow">→</span>
                <span className="after">0〜1件</span>
              </div>
            </div>
            <div className="result-card animate-on-scroll" style={{ opacity: 0, animationDelay: '0.2s' }}>
              <div className="result-label">掘り起こし</div>
              <div className="result-numbers">
                <span className="before">0件</span>
                <span className="arrow">→</span>
                <span className="after">平均13件</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Provided Section */}
      <section className="section system">
        <div className="container">
          <h2 className="section-title animate-on-scroll" style={{ opacity: 0 }}>提供内容</h2>
          <div style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--color-text-muted)', fontSize: '1.1rem', opacity: 0 }} className="animate-on-scroll">
            <p>システムを導入するだけではありません個人事業主ならではの細やかなサポートで、<br />貴院の現場に合わせた最適な仕組みづくりから日々の運用まで支援します</p>
          </div>
          <div className="system-content">
            <div className="system-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { title: '予約フォーム制作', desc: '迷わず予約できるフォームを構築' },
                { title: 'LINE導線設計', desc: '問い合わせから予約へのスムーズな流れ' },
                { title: '自動応答設計', desc: 'よくある質問への自動返信を設定' },
                { title: '予約確定フォロー', desc: '事前案内や確認メッセージを自動化' },
                { title: 'リマインド運用', desc: '前日・当日のリマインドでキャンセル削減' },
                { title: '掘り起こし支援', desc: '過去の患者様に合わせたメッセージ配信' },
                { title: '分析レポート', desc: '予約率やキャンセル率などのデータ報告' },
                { title: '改善提案', desc: 'データに基づき次の一手をご提案' }
              ].map((service, i) => (
                <div key={i} className="system-feature animate-on-scroll" style={{ opacity: 0, animationDelay: `${(i % 4) * 0.1}s`, background: '#fff', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid var(--color-primary)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--color-primary-dark)' }}>{service.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{service.desc}</p>
                </div>
              ))}
            </div>
            <div className="system-image-wrapper animate-on-scroll" style={{ opacity: 0, animationDelay: '0.2s' }}>
              <img src="/system_mockup.png" alt="System Dashboard Mockup" className="system-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Flow Section */}
      <section className="section flow">
        <div className="container">
          <h2 className="section-title animate-on-scroll" style={{ opacity: 0 }}>サポートイメージ</h2>
          <div className="flow-container">
            {['問い合わせ', '予約フォーム', 'LINE', '予約確定', '来院', '掘り起こし', '再来院'].map((step, i) => (
              <div key={i} className="flow-step animate-on-scroll" style={{ opacity: 0, animationDelay: `${i * 0.1}s` }}>
                <div className="flow-box">{step}</div>
                {i < 6 && <div className="flow-arrow"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Features (AI) Section */}
      <section className="section ai">
        <div className="container">
          <h2 className="section-title animate-on-scroll" style={{ opacity: 0 }}>将来機能（順次追加予定）</h2>
          <div className="system-content" style={{ marginTop: '3rem' }}>
            <div className="system-image-wrapper animate-on-scroll" style={{ opacity: 0 }}>
              <img src="/ai_analysis.png" alt="AI Analysis Graphic" className="system-image" />
            </div>
            <div className="ai-grid animate-on-scroll" style={{ opacity: 0, animationDelay: '0.2s' }}>
              {[
                { icon: '👥', title: '患者分析' },
                { icon: '💬', title: 'LINE分析' },
                { icon: '📈', title: '予約率分析' },
                { icon: '💡', title: 'AI改善提案' },
              ].map((item, i) => (
                <div key={i} className="ai-card">
                  <div className="ai-card-icon">{item.icon}</div>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="section cta-section">
        <div className="container animate-on-scroll" style={{ opacity: 0 }}>
          <h2 className="cta-title">システムだけではなく、運用までサポートします</h2>
          <p className="cta-desc">
            まずは貴院の現状のお悩みをお聞かせください<br />
            個人事業主ならではの、現場に寄り添った柔軟なサポートをご提案いたします
          </p>
          <div className="cta-buttons">
            <a href="#" className="btn btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>無料相談受付中</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} DentalConnect 予約導線改善サポート. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

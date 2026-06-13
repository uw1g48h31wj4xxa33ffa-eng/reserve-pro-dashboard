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
            <span>Dental Reserve Pro</span>
          </div>
          <a href="#contact" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '1rem' }}>無料相談</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <img src="/fv_bg.png" alt="Dental Clinic Background" className="hero-bg" />
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-on-scroll" style={{ opacity: 0 }}>
          <span className="hero-badge">歯科医院向け LINE予約導線最適化サービス</span>
          <h1 className="hero-title">
            問い合わせを<br />
            <span>予約につなげる</span>仕組みを。
          </h1>
          <p className="hero-subtitle">
            問い合わせから予約確定、掘り起こしまで。<br />
            予約率改善のための仕組みをご提供します。
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
              "問い合わせは来るのに予約につながらない",
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
                <span className="before">月0件</span>
                <span className="arrow">→</span>
                <span className="after">平均13件</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flow Section */}
      <section className="section flow">
        <div className="container">
          <h2 className="section-title animate-on-scroll" style={{ opacity: 0 }}>解決へのステップ</h2>
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

      {/* System Section */}
      <section className="section system">
        <div className="container">
          <h2 className="section-title animate-on-scroll" style={{ opacity: 0 }}>最適化された管理環境</h2>
          <div className="system-content">
            <div className="system-features animate-on-scroll" style={{ opacity: 0 }}>
              <div className="system-feature">
                <h3>予約管理</h3>
                <p>直感的なUIで、日々の予約状況を瞬時に把握。ダブルブッキングを防ぎます。</p>
              </div>
              <div className="system-feature">
                <h3>LINE連携</h3>
                <p>患者様とのコミュニケーションをLINEに集約。自動リマインドでキャンセルを防止。</p>
              </div>
              <div className="system-feature">
                <h3>患者管理</h3>
                <p>カルテ情報と連携し、一人ひとりに合わせたパーソナライズされた対応を実現。</p>
              </div>
              <div className="system-feature">
                <h3>分析画面</h3>
                <p>予約率やキャンセル率、スタッフ別の対応状況など、経営指標を可視化します。</p>
              </div>
            </div>
            <div className="system-image-wrapper animate-on-scroll" style={{ opacity: 0, animationDelay: '0.2s' }}>
              <img src="/system_mockup.png" alt="System Dashboard Mockup" className="system-image" />
            </div>
          </div>
        </div>
      </section>

      {/* AI Analysis Section */}
      <section className="section ai">
        <div className="container">
          <h2 className="section-title animate-on-scroll" style={{ opacity: 0 }}>最先端のAI分析機能</h2>
          <div className="system-content" style={{ marginTop: '3rem' }}>
            <div className="system-image-wrapper animate-on-scroll" style={{ opacity: 0 }}>
              <img src="/ai_analysis.png" alt="AI Analysis Graphic" className="system-image" />
            </div>
            <div className="ai-grid animate-on-scroll" style={{ opacity: 0, animationDelay: '0.2s' }}>
              {[
                { icon: '🧠', title: '患者行動分析' },
                { icon: '📈', title: '予約率分析' },
                { icon: '🎯', title: '掘り起こし分析' },
                { icon: '👥', title: '患者分類' },
                { icon: '💬', title: 'LINE分析' },
                { icon: '💡', title: '改善提案' },
              ].map((item, i) => (
                <div key={i} className="ai-card">
                  <div className="ai-card-icon">{item.icon}</div>
                  <h4>{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="section cta-section">
        <div className="container animate-on-scroll" style={{ opacity: 0 }}>
          <h2 className="cta-title">まずは現状の課題をお聞かせください</h2>
          <p className="cta-desc">
            貴院の状況に合わせた最適な予約率改善の仕組みをご提案いたします。
            オンラインでの無料相談やデモ画面のご案内も承っております。
          </p>
          <div className="cta-buttons">
            <a href="#" className="btn btn-primary">無料相談に申し込む</a>
            <a href="#" className="btn btn-secondary">デモ画面を依頼する</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Dental Reserve Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

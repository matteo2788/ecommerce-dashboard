import { useEffect, useState } from 'react';
import './styles.css';

const business = { pairs: 120, price: 149, cost: 95 };
const sales = business.pairs * business.price;
const productCost = business.pairs * business.cost;
const remaining = sales - productCost;
const money = value => '$' + value.toLocaleString('en-CA');
const sections = [['overview', 'Overview'], ['numbers', 'Numbers'], ['built', 'How I Built It'], ['learned', 'What I Learned']];
const work = [
  ['01', 'Source & brand', 'I sourced sneakers from overseas suppliers and branded the products for my own store.'],
  ['02', 'Build the store', 'I built and managed the website with WordPress and WooCommerce, from product listings to the buying experience.'],
  ['03', 'Price & sell', 'I set the selling price and created the product listings customers used to decide what to buy.'],
  ['04', 'Run the day-to-day', 'I handled customer questions and managed orders myself throughout the seven months the store ran.'],
];

function Breakdown({ perPair = false }) {
  const total = perPair ? business.price : sales;
  const cost = perPair ? business.cost : productCost;
  const balance = total - cost;
  return <>
    <div className="stacked" role="img" aria-label={`${perPair ? '' : 'Approximately '}${money(total)} in sales: ${money(cost)} product cost and ${money(balance)} remaining before other expenses.`}>
      <span className="cost-segment" style={{ width: `${cost / total * 100}%` }} />
      <span className="balance-segment" style={{ width: `${balance / total * 100}%` }} />
    </div>
    <div className="chart-labels"><span>Product cost</span><span>After product cost</span></div>
    <div className="breakdown-row"><span><i className="dot purple" />Product cost</span><strong>≈{money(cost)}</strong></div>
    <div className="breakdown-row"><span><i className="dot lime" />After product cost</span><strong>≈{money(balance)}</strong></div>
  </>;
}

export default function Dashboard() {
  const [active, setActive] = useState('overview');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-15% 0px -50% 0px', threshold: 0 });
    sections.forEach(([id]) => observer.observe(document.getElementById(id)));
    return () => observer.disconnect();
  }, []);
  return <>
    <a className="skip" href="#overview">Skip to content</a>
    <div className="page-frame">
      <header className="topbar">
        <a className="identity" href="#overview" aria-label="Matteo Conforti, overview"><span className="mark" aria-hidden="true">m<span>.</span></span><span>Matteo Conforti<small>Independent project</small></span></a>
        <nav aria-label="Case study sections">{sections.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined} onClick={() => setActive(id)}>{label}</a>)}</nav>
        <span className="archive"><i className="dot lime" />2023 / 2024</span>
      </header>
      <main>
        <section id="overview" className="overview">
          <div className="intro-meta"><span className="eyebrow">E-commerce case study</span><span className="date">December 2023 – June 2024</span></div>
          <div className="intro"><div><h1>A store I built.<br /><span>A business I ran.</span></h1><p>I built and ran a small online sneaker store using WordPress and WooCommerce. I handled the products, website, pricing, customer questions, and orders myself.</p></div><div className="intro-aside"><span className="pill">Seven months in business</span><p>From sourcing overseas<br />to selling through my own store.</p><a className="text-link" href="#built">See how I built it <span aria-hidden="true">↗</span></a></div></div>
          <div className="metrics" aria-label="Estimated business results">
            <div className="metric lead"><span>Estimated sales</span><strong>≈$17.9K</strong><small>≈120 pairs × $149</small></div>
            <div className="metric"><span>Pairs sold</span><strong>≈120</strong><small>Over seven months</small></div>
            <div className="metric"><span>Selling price</span><strong>$149</strong><small>Average per pair</small></div>
            <div className="metric"><span>Product cost</span><strong>≈$95</strong><small>Average per pair</small></div>
          </div>
        </section>
        <section id="numbers" className="numbers">
          <div className="section-heading"><h2>The numbers</h2><span>Estimated from the store’s sales and costs</span></div>
          <div className="charts">
            <article className="panel revenue-panel"><div className="panel-top"><h3>Where the sales went</h3><span className="micro-tag">Full period</span></div><div className="chart-total"><span>Total sales</span><strong>≈{money(sales)}</strong></div><Breakdown /><p className="panel-foot">Based on approximately 120 pairs sold at an average of $149 each.</p></article>
            <article className="panel pair-panel"><div className="panel-top"><h3>One pair, broken down</h3><span className="micro-tag">Per pair</span></div><div className="chart-total"><span>Average selling price</span><strong>{money(business.price)}</strong></div><Breakdown perPair /><p className="panel-foot">$149 selling price − approximately $95 product cost.</p></article>
          </div>
          <aside className="expense-note"><div><span className="eyebrow">After product cost</span><strong>≈$6,480</strong></div><p>This is the revenue remaining after paying for the products. It is <b>before shipping, payment processing fees, refunds, advertising, and other expenses.</b> It is not net profit.</p></aside>
          <p className="data-note"><span>About these figures</span>These are approximate totals from a small business I ran several years ago. The breakdowns use the same sales and product cost estimates. Monthly sales and website traffic are not included because I do not have reliable figures for them.</p>
        </section>
        <section id="built" className="built editorial-section"><div className="editorial-heading"><span className="eyebrow">The work behind it</span><h2>From supplier<br />to storefront.</h2><p>I managed the store myself, so the work went well beyond putting products on a website.</p><div className="tools"><span>WordPress</span><span>WooCommerce</span></div></div><div className="process">{work.map(([number, title, description]) => <article key={number}><span className="step">{number}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>
        <section id="learned" className="learned editorial-section"><div className="editorial-heading"><span className="eyebrow">What I learned</span><h2>The details<br />add up.</h2><p>Running a small store gave me a closer look at how the different parts of a business fit together.</p></div><div className="lessons"><article><h3>A selling price is only part of the picture.</h3><p>The gap between the selling price and sourcing cost still has to cover the other expenses. Looking at revenue alone does not tell the whole story.</p></article><article><h3>The product page is part of the sale.</h3><p>Building the listings and answering questions made me think about what someone needs to understand before buying.</p></article><article><h3>The website and the business go together.</h3><p>I was responsible for both the store people used and the orders behind it. That gave me practical experience with the whole buying process.</p></article></div></section>
      </main>
      <footer><span>Matteo Conforti <span className="footer-muted">/ E-Commerce Store</span></span><a href="#overview">Back to overview <span aria-hidden="true">↑</span></a></footer>
    </div>
  </>;
}

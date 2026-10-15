# PUNTA BIKERS - Design System & UI Improvements

**Generated:** 2026-10-15  
**Based on:** ui-ux-pro-max skill analysis + glassmorphism pattern

---

## 🎨 Design System

### Pattern: Hero + Features + CTA
- **Landing page**: Hero section + value props + features grid + CTA
- **CTA Placement**: Sticky navigation + bottom section
- **Color Strategy**: Brand primary/vibrant hero, card backgrounds light, CTA accent

### Style: Glassmorphism
- **Effect**: Backdrop blur (10-20px), 1px border (rgba white 0.2), subtle depth layers
- **Best for**: Modern SaaS, dashboards, modals, navigation
- **Light mode only** (avoid dark mode for this product)
- **Accessibility**: Requires 4.5:1 contrast on text, visible keyboard focus, respect `prefers-reduced-motion`

### Colors (Optimized)
| Role | Current | Optimized | CSS Variable |
|------|---------|-----------|--------------|
| Primary | #004E89 | #2563EB | `--color-primary` |
| Accent/CTA | #FF6B35 | #EA580C | `--color-accent` |
| Background | N/A | #F8FAFC | `--color-background` |
| Card | N/A | #FFFFFF | `--color-card` |
| Border | N/A | #E2E8F0 | `--color-border` |
| Destructive | N/A | #DC2626 | `--color-destructive` |

### Typography
- **Font**: Plus Jakarta Sans (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Mood**: Friendly, modern, professional, approachable
- **Usage**:
  - Headings: 600-700 weight (h1-h6 size scale)
  - Body: 400 weight, 16px base, 1.5 line-height
  - Small text: 14px (14/16 relative)

### CSS Variables Setup
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

:root {
  /* Colors */
  --color-primary: #2563EB;
  --color-secondary: #3B82F6;
  --color-accent: #EA580C;
  --color-background: #F8FAFC;
  --color-foreground: #1E293B;
  --color-card: #FFFFFF;
  --color-muted: #E9EFF8;
  --color-border: #E2E8F0;
  --color-destructive: #DC2626;

  /* Typography */
  --font-sans: 'Plus Jakarta Sans', sans-serif;

  /* Spacing (4px scale) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Glassmorphism */
  --backdrop-blur: 10px;
  --glass-border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

---

## 🎯 Screen-by-Screen Improvements

### 1. **Pricing** (`/pricing`)

#### Current Issues
- ✅ Layout is solid
- ⚠️ Missing accessibility on price comparisons
- ⚠️ FAQ section needs better structure

#### Improvements
- Add ARIA labels to pricing cards
- Use `<table role="presentation">` for features comparison
- Add keyboard navigation between cards (Tab)
- Ensure CTA buttons have 44px minimum height

#### Code: Accessible Pricing Cards
```tsx
// pricing/page.tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {plans.map((plan) => (
    <div
      key={plan.id}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8"
      aria-label={`${plan.name} plan: ${plan.price} per ${plan.period}`}
      role="region"
      tabIndex={0}
    >
      {/* ... */}
    </div>
  ))}
</div>

// FAQ with proper structure
<div className="space-y-4">
  {faqs.map((item, i) => (
    <details
      key={i}
      className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer"
      open={openIndex === i}
      onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
    >
      <summary className="font-bold text-lg cursor-pointer">
        {item.q}
      </summary>
      <p className="text-slate-300 mt-3">{item.a}</p>
    </details>
  ))}
</div>
```

---

### 2. **About** (`/about`)

#### Current Issues
- ✅ Good story structure
- ⚠️ Team section needs better image placeholders
- ⚠️ Statistics could use better visual hierarchy

#### Improvements
- Add image alt-text and loading placeholders
- Use semantic HTML5 (semantic card wrappers)
- Increase button size to 44px minimum
- Add `prefers-reduced-motion` for animations

#### Code: Accessible Team Cards
```tsx
// about/page.tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {team.map((member) => (
    <article
      key={member.id}
      className="border border-white/20 rounded-lg p-6"
    >
      {/* Image with alt text */}
      <img
        src={`/team/${member.slug}.jpg`}
        alt={`${member.name}, ${member.role}`}
        className="w-32 h-32 rounded-full mb-4 object-cover"
      />
      <h3 className="text-lg font-bold">{member.name}</h3>
      <p className="text-orange-400 text-sm mb-2">{member.role}</p>
      <p className="text-slate-300">{member.bio}</p>
    </article>
  ))}
</div>
```

---

### 3. **Contact** (`/contact`) - PRIORITY FIX

#### Current Issues
- ❌ Form labels are separate divs, not linked to inputs
- ❌ No error handling or validation feedback
- ❌ Submit button is too small (< 44px)

#### Improvements
1. **Accessibility**: Link labels to inputs with `htmlFor`
2. **Validation**: Add inline error feedback + error summary
3. **Touch targets**: Increase button to 44px min height
4. **Feedback**: Show loading state, success/error confirmation
5. **Form structure**: Proper fieldset for related inputs

#### Code: Accessible Contact Form
```tsx
'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) 
      newErrors.email = 'Invalid email format'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      setStatus('error')
      return
    }

    setIsLoading(true)
    try {
      // Submit form
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus(null), 3000)
    } catch (error) {
      setStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>{/* ... */}</div>

          {/* Form */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
            {status === 'success' && (
              <div
                className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6"
                role="alert"
              >
                <p className="text-green-300">✓ Message sent successfully!</p>
              </div>
            )}

            {/* Error Summary */}
            {Object.keys(errors).length > 0 && (
              <div
                role="alert"
                aria-labelledby="error-title"
                className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6"
              >
                <h2 id="error-title" className="font-bold text-red-300 mb-2">
                  Please fix the following errors:
                </h2>
                <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>
                      <a href={`#${field}`}>{error}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                  Name <span aria-label="required">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  required
                />
                {errors.name && (
                  <p id="name-error" className="text-red-400 text-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  Email <span aria-label="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  required
                />
                {errors.email && (
                  <p id="email-error" className="text-red-400 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                  Subject <span aria-label="required">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  required
                />
                {errors.subject && (
                  <p id="subject-error" className="text-red-400 text-sm mt-1">
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2">
                  Message <span aria-label="required">*</span>
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  rows={5}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white resize-none"
                  required
                />
                {errors.message && (
                  <p id="message-error" className="text-red-400 text-sm mt-1">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 disabled:opacity-50 h-11 font-semibold rounded-lg transition-all duration-200"
                aria-busy={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 4. **Forgot Password** (`/auth/forgot-password`)

#### Current Issues
- ✅ Good structure
- ⚠️ Button is small (< 44px)
- ⚠️ Missing validation feedback

#### Improvements
- Increase button to 44px minimum
- Add inline validation for email format
- Add loading state during submission
- Better error messaging

#### Code: Button Fix
```tsx
<button
  type="submit"
  className="w-full h-11 bg-gradient-to-r from-blue-500 to-orange-500 
             hover:from-blue-600 hover:to-orange-600 font-semibold 
             rounded-lg transition-all duration-200"
>
  Send Reset Link
</button>
```

---

### 5. **Payments History** (`/dashboard/payments`) - PRIORITY FIX

#### Current Issues
- ❌ Table overflows on mobile (no scroll indicator)
- ❌ Status badges lack proper contrast
- ❌ No loading states for action buttons
- ⚠️ Filter buttons not keyboard accessible

#### Improvements
1. **Mobile table**: Add `overflow-x-auto` with scroll hint
2. **Status colors**: Use WCAG-compliant colors
3. **Button states**: Add hover, active, disabled states
4. **Keyboard**: Make filter buttons keyboard accessible
5. **Accessibility**: Add table captions and header scopes

#### Code: Accessible Table
```tsx
export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Payment History</h1>

        {/* Filter buttons with keyboard support */}
        <div className="flex gap-3 mb-8" role="group" aria-label="Filter payments">
          {['All', 'Completed', 'Pending'].map((filter) => (
            <button
              key={filter}
              className={`h-10 px-4 rounded-lg transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-orange-500/30 border border-orange-400/50'
                  : 'bg-white/10 border border-white/20 hover:bg-white/15'
              }`}
              aria-pressed={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Accessible table */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto" role="region" aria-label="Payments table">
            <table className="w-full text-sm" role="presentation">
              <caption className="sr-only">Payment history with date, amount, and status</caption>
              <thead>
                <tr className="border-b border-white/20">
                  <th scope="col" className="px-6 py-4 text-left font-semibold">ID</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold">Rental</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold">Amount</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold">Date</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold">Status</th>
                  <th scope="col" className="px-6 py-4 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-300">{payment.id}</td>
                    <td className="px-6 py-4 text-sm">{payment.rental}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{payment.amount}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{payment.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'Completed'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                        aria-label={`Payment status: ${payment.status}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        className="text-orange-400 hover:text-orange-300 font-semibold text-xs h-9 px-3 rounded-lg hover:bg-white/10 transition-all"
                        aria-label={`View details for payment ${payment.id}`}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 6. **Rental Details** (`/dashboard/rentals/[id]`) - PRIORITY FIX

#### Current Issues
- ⚠️ Action buttons are small (< 44px)
- ⚠️ Map placeholder needs proper aspect ratio
- ⚠️ Battery progress bar lacks contrast
- ⚠️ Modal-like back button could confuse

#### Improvements
1. **Buttons**: Increase to 44px height with proper spacing
2. **Map**: Use proper aspect ratio (`aspect-video`)
3. **Progress**: Ensure 4.5:1 contrast ratio
4. **Layout**: Better sidebar behavior on mobile
5. **Back link**: Clearer navigation

#### Code: Button & Layout Fixes
```tsx
export default function RentalDetailsPage({ params }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <a
          href="/dashboard/rentals"
          className="text-orange-400 hover:text-orange-300 text-sm mb-4 inline-flex items-center gap-1"
        >
          ← Back to Rentals
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Battery with proper contrast */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
              <div className="flex justify-between mb-2">
                <p className="font-semibold">Battery Level</p>
                <p className="text-orange-400 font-bold">92%</p>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all"
                  style={{ width: '92%' }}
                  role="progressbar"
                  aria-valuenow={92}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Battery level: 92 percent"
                />
              </div>
            </div>

            {/* Map with proper aspect ratio */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
              <div className="relative w-full aspect-video bg-gradient-to-br from-blue-500/20 to-orange-500/20 flex items-center justify-center">
                <p className="text-slate-300">📍 Map view (coming soon)</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions with 44px minimum */}
            <div className="space-y-3">
              <button
                className="w-full bg-white/20 hover:bg-white/30 h-11 rounded-lg font-semibold transition-all"
                aria-label="Contact support team"
              >
                📞 Contact Support
              </button>
              <button
                className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 h-11 rounded-lg font-semibold transition-all"
                aria-label="Proceed to payment"
              >
                💳 Make Payment
              </button>
              <button
                className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 h-11 rounded-lg font-semibold transition-all"
                aria-label="End this rental"
              >
                ❌ End Rental
              </button>
            </div>

            {/* Info sections */}
            {/* ... */}
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 7. **Admin Dashboard** (`/admin`)

#### Current Issues
- ⚠️ Menu grid items lack proper focus states
- ⚠️ Activity timeline could be a list
- ⚠️ Stats cards need better semantic structure

#### Improvements
1. **Grid items**: Add focus rings and hover states
2. **Timeline**: Use `<ol>` for proper structure
3. **Stats**: Use proper heading levels and ARIA labels
4. **Interactive**: Ensure all items are keyboard navigable

#### Code: Accessible Menu Grid
```tsx
<div
  className="grid grid-cols-1 md:grid-cols-2 gap-4"
  role="list"
  aria-label="Admin management options"
>
  {[
    { icon: '🛴', title: 'Scooters', desc: 'Manage fleet inventory', link: '/admin/scooters' },
    { icon: '👥', title: 'Users', desc: 'View and manage users', link: '/admin/users' },
    // ...
  ].map((item, i) => (
    <a
      key={i}
      href={item.link}
      className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all cursor-pointer"
      role="listitem"
      aria-label={`${item.title}: ${item.desc}`}
    >
      <div className="text-3xl mb-2">{item.icon}</div>
      <h3 className="font-bold mb-1">{item.title}</h3>
      <p className="text-xs text-slate-400">{item.desc}</p>
    </a>
  ))}
</div>
```

---

### 8. **Reports & Analytics** (`/admin/reports`)

#### Current Issues
- ⚠️ Chart placeholders need labels
- ⚠️ Date picker lacks proper labeling
- ⚠️ Export buttons need loading states

#### Improvements
1. **Charts**: Add accessible chart descriptions
2. **Date picker**: Label with proper `<label>` tags
3. **Export**: Show loading state and confirmation
4. **Export buttons**: Increase touch target to 44px

#### Code: Accessible Date Range
```tsx
<div className="flex flex-col sm:flex-row gap-4 mb-8">
  <fieldset className="flex gap-2 border border-white/20 rounded-lg p-2">
    <legend className="sr-only">Date range selection</legend>
    <label htmlFor="from-date" className="text-sm text-slate-300">From:</label>
    <input
      id="from-date"
      type="date"
      className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
      aria-label="Start date for report"
    />
    <label htmlFor="to-date" className="text-sm text-slate-300">To:</label>
    <input
      id="to-date"
      type="date"
      className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
      aria-label="End date for report"
    />
  </fieldset>

  <div className="flex gap-2 ml-auto">
    <button
      className="h-11 px-4 border-white/30 hover:bg-white/10 rounded-lg transition-all font-semibold"
      aria-label="Export data as CSV"
    >
      📊 Export CSV
    </button>
    <button
      className="h-11 px-4 border-white/30 hover:bg-white/10 rounded-lg transition-all font-semibold"
      aria-label="Export data as PDF"
    >
      📥 Export PDF
    </button>
  </div>
</div>
```

---

## 🚀 Pre-Delivery Checklist

- [ ] **No emoji icons** - Use SVG icons (Heroicons, Lucide)
- [ ] **cursor-pointer** on all clickable elements
- [ ] **Touch targets** minimum 44px (web: 24px + WCAG Target Size)
- [ ] **8px gap** between adjacent touch targets
- [ ] **Contrast 4.5:1** for normal text (light mode)
- [ ] **Focus states** visible (ring-2 ring-orange-400)
- [ ] **prefers-reduced-motion** respected globally
- [ ] **Responsive breakpoints**: 375px, 768px, 1024px, 1440px tested
- [ ] **Form labels** linked with `htmlFor`
- [ ] **Error summaries** with role="alert" and focus management
- [ ] **Loading states** on async buttons
- [ ] **Keyboard navigation** (Tab, Shift+Tab, Enter)
- [ ] **ARIA labels** on chart/data elements
- [ ] **Alt text** on all images
- [ ] **Semantic HTML** (`<button>`, `<label>`, `<fieldset>`, `<section>`)

---

## 📱 Responsive Testing Checklist

Test each screen at:
- ✅ **Mobile**: 375px (iPhone SE), 414px (iPhone 12)
- ✅ **Tablet**: 768px (iPad)
- ✅ **Desktop**: 1024px, 1440px
- ✅ **Touch**: Simulate touch with DevTools mobile emulation
- ✅ **Keyboard**: Navigate with Tab, Shift+Tab, Enter, Space
- ✅ **Screen reader**: Test with NVDA or JAWS (Windows) or VoiceOver (Mac)

---

## 🎬 Implementation Priority

1. **URGENT** (This sprint)
   - Contact form: Add validation + error handling
   - Payments table: Fix mobile overflow + button sizes
   - Rental details: Fix button sizes + sidebar responsiveness

2. **HIGH** (Next sprint)
   - All screens: Update button sizes to 44px
   - All screens: Add focus ring styling (ring-2 ring-orange-400)
   - Forms: Add loading states and feedback

3. **MEDIUM** (Sprint after)
   - Charts: Add accessible descriptions
   - Admin: Add keyboard navigation
   - Animations: Add `prefers-reduced-motion` support

---

**Last Updated:** 2026-10-15  
**Design System Base:** ui-ux-pro-max skill analysis

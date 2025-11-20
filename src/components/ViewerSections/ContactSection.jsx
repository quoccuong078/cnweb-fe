// src/components/ViewerSections/ContactSection.jsx
export default function ContactSection({ data, color = "blue" }) {
  return (
    <section id="contact" className={`py-20 bg-${color}-600 text-white`}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-8">{data.title || "Liên Hệ"}</h2>
        <form className="space-y-6 max-w-lg mx-auto">
          <input type="text" placeholder={data.namePlaceholder || "Họ tên"} className="w-full p-4 rounded bg-white/20 placeholder-white/70 text-white" />
          <input type="email" placeholder={data.emailPlaceholder || "Email"} className="w-full p-4 rounded bg-white/20 placeholder-white/70" />
          <textarea rows={5} placeholder={data.messagePlaceholder || "Nội dung..."} className="w-full p-4 rounded bg-white/20 placeholder-white/70 resize-none"></textarea>
          <button type="submit" className="w-full bg-white text-gray-800 py-4 rounded font-bold hover:bg-gray-100 transition">
            {data.buttonText || "Gửi tin nhắn"}
          </button>
        </form>
      </div>
    </section>
  );
}
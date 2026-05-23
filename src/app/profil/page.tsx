
import Image from "next/image";
import { CheckCircle2, Target, History, Users2, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const visionItems = [
  "Mewujudkan lulusan yang bertaqwa kepada Tuhan Yang Maha Esa.",
  "Membentuk karakter siswa yang mandiri, kreatif, dan inovatif.",
  "Meningkatkan kualitas pembelajaran berbasis teknologi digital.",
  "Membangun kerjasama internasional dengan institusi pendidikan global."
];

export default function ProfilPage() {
  return (
    <div className="pt-24">
      {/* Page Header */}
      <section className="bg-primary py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/10 skew-y-3 translate-y-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">Profil Sekolah</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">Mengenal lebih dekat perjalanan, nilai, dan infrastruktur EduVista SMP.</p>
        </div>
      </section>

      {/* Sejarah Section */}
      <section id="sejarah" className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2">
              <div className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 flex items-center gap-2">
                <History className="h-4 w-4" /> Sejarah Kami
              </div>
              <h2 className="text-4xl font-bold text-primary font-headline mb-6">Dedikasi Terhadap Pendidikan Sejak 1998</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  Berawal dari sebuah komitmen kecil untuk memberikan akses pendidikan berkualitas bagi masyarakat sekitar, EduVista SMP didirikan pada tahun 1998 di bawah naungan Yayasan EduVista Nusantara.
                </p>
                <p>
                  Selama lebih dari dua dekade, kami telah bertransformasi dari sekolah menengah konvensional menjadi institusi pendidikan modern yang mengadopsi teknologi terbaru namun tetap menjunjung tinggi nilai-nilai karakter luhur.
                </p>
                <p>
                  Hari ini, EduVista SMP dikenal sebagai salah satu sekolah unggulan yang telah meluluskan ribuan alumni sukses yang tersebar di berbagai sektor profesional.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2">
               <Image 
                src="https://picsum.photos/seed/school-old/800/600" 
                alt="Old School Building" 
                width={800} 
                height={600} 
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section id="visi-misi" className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-12 rounded-3xl shadow-xl space-y-6">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-primary font-headline">Visi Kami</h3>
              <p className="text-xl text-muted-foreground italic leading-relaxed">
                "Menjadi pusat pendidikan menengah terbaik yang melahirkan generasi cerdas, berkarakter, dan kompetitif secara global pada tahun 2030."
              </p>
            </div>
            <div className="bg-primary p-12 rounded-3xl shadow-xl text-white space-y-6">
              <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <Users2 className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold font-headline">Misi Kami</h3>
              <ul className="space-y-4">
                {visionItems.map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <CheckCircle2 className="h-6 w-6 text-secondary shrink-0" />
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fasilitas Section */}
      <section id="fasilitas" className="py-24">
        <div className="container mx-auto px-4">
           <div className="text-center mb-16">
            <div className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 flex items-center justify-center gap-2">
              <Building2 className="h-4 w-4" /> Fasilitas Sekolah
            </div>
            <h2 className="text-4xl font-bold text-primary font-headline">Lingkungan Belajar yang Mendukung</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Lab Komputer", img: "https://picsum.photos/seed/pc-lab/600/400", desc: "Dilengkapi dengan unit PC terbaru dan koneksi internet high-speed." },
              { title: "Perpustakaan Digital", img: "https://picsum.photos/seed/digital-lib/600/400", desc: "Akses ke ribuan e-book dan jurnal internasional melalui tablet." },
              { title: "Studio Seni & Musik", img: "https://picsum.photos/seed/art-studio/600/400", desc: "Ruang kedap suara dengan instrumen lengkap untuk mengasah kreativitas." },
              { title: "Gedung Olahraga", img: "https://picsum.photos/seed/gym/600/400", desc: "Lapangan indoor multifungsi untuk basket, futsal, dan badminton." },
              { title: "Kantin Sehat", img: "https://picsum.photos/seed/canteen/600/400", desc: "Menyediakan makanan bergizi dengan standar kebersihan tinggi." },
              { title: "Masjid Sekolah", img: "https://picsum.photos/seed/mosque/600/400", desc: "Sarana ibadah yang nyaman untuk kegiatan religius siswa." },
            ].map((f, i) => (
              <Card key={i} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all">
                <Image src={f.img} alt={f.title} width={600} height={400} className="w-full h-48 object-cover" />
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold text-primary font-headline mb-2">{f.title}</h4>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

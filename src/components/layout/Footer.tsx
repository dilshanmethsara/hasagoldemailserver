import { Gamepad2, Twitter, Instagram, Youtube, Facebook, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 glass mt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container py-16 grid gap-12 md:grid-cols-4"
      >
        <div>
          <Link to="/" className="flex items-center gap-3 mb-6 group">
            <div className="relative">
              {/* Golden circle effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full blur-md opacity-60 group-hover:opacity-80 transition-all duration-500 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-full blur-sm opacity-40 group-hover:opacity-60 transition-all duration-300" />
              <div className="relative h-10 w-10 rounded-full overflow-hidden shadow-glow border-2 border-yellow-500/50">
                <img 
                  src="/hasalogo.png" 
                  alt="HASA GOLD STORE Logo" 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-yellow-500 font-bold text-lg">HG</span>';
                    }
                  }}
                />
              </div>
            </div>
            <span className="font-display font-black text-2xl tracking-tighter">
              HASA <span className="text-gradient">GOLD</span>
            </span>
          </Link>
          <p className="text-muted-foreground leading-relaxed">
            The fastest, most secure way to top up your favorite mobile games. Join 2M+ gamers who trust us daily.
          </p>
          <div className="flex gap-3 mt-6">
            <motion.a
              href="https://www.tiktok.com/@hasaplaysofficial?_r=1&_t=ZS-961Itxki2g1"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.1 }}
              className="h-10 w-10 rounded-xl bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-500 flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-yellow-500/30"
              aria-label="TikTok"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                <path d="M19.589 9.91c-.33-.415-.736-.78-1.212-1.09-.476-.31-1.008-.548-1.567-.698v-3.622c1.378-.188 2.472-1.275 2.472-2.65 0-1.493-1.222-2.715-2.715-2.715s-2.716 1.222-2.716 2.715c0 1.375 1.094 2.462 2.472 2.65v3.622c-.559.15-1.09.388-1.567.698-.476.31-.882.675-1.212 1.09l-2.835-2.835c.311-.476.548-1.008.698-1.567h3.622c.188 1.378 1.275 2.472 2.65 2.472 1.493 0 2.715-1.222 2.715-2.715s-1.222-2.716-2.715-2.716c-1.375 0-2.462 1.094-2.65 2.472h-3.622c-.15-.559-.388-1.09-.698-1.567-.31-.476-.675-.882-1.09-1.212l2.835-2.835c.415.33.78.736 1.09 1.212.31.476.548 1.008.698 1.567h3.622c.188-1.378 1.275-2.472 2.65-2.472 1.493 0 2.715 1.222 2.715 2.715s-1.222 2.716-2.715 2.716c-1.375 0-2.462-1.094-2.65-2.472h-3.622c-.15.559-.388 1.09-.698 1.567-.31.476-.675.882-1.09 1.212l-2.835 2.835c-.476-.311-1.008-.548-1.567-.698z"/>
              </svg>
            </motion.a>
            <motion.a
              href="https://wa.me/94763046704"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.1 }}
              className="h-10 w-10 rounded-xl bg-white/5 hover:bg-green-500/20 hover:text-green-500 flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-green-500/30"
              aria-label="WhatsApp"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.21 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </motion.a>
            <motion.a
              href="https://youtube.com/@hasaplaysofficial?si=B3J6_EZH2R71PNMc"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.1 }}
              className="h-10 w-10 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-red-500/30"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ y: -3, scale: 1.1 }}
              className="h-10 w-10 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-primary/30"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ y: -3, scale: 1.1 }}
              className="h-10 w-10 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-primary/30"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </motion.a>
            <motion.a
              href="https://www.facebook.com/gaminghasa1?share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1GHCvGLaSG%2F#"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.1 }}
              className="h-10 w-10 rounded-xl bg-white/5 hover:bg-blue-500/20 hover:text-blue-500 flex items-center justify-center transition-all duration-300 border border-white/5 hover:border-blue-500/30"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </motion.a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Products</h4>
          <ul className="space-y-3 text-muted-foreground">
            <li><Link to="/games" className="hover:text-primary transition-colors">All Games</Link></li>
            <li><Link to="/games" className="hover:text-primary transition-colors">Free Fire</Link></li>
            <li><Link to="/games" className="hover:text-primary transition-colors">PUBG Mobile</Link></li>
            <li><Link to="/games" className="hover:text-primary transition-colors">Mobile Legends</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Support</h4>
          <ul className="space-y-3 text-muted-foreground">
            <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Live Chat</a></li>
            <li>
              <a 
                href="https://wa.me/94763046704" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors group"
              >
                <MessageCircle className="h-4 w-4 group-hover:text-green-400 transition-colors" />
                WhatsApp Help: +94763046704
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Company</h4>
          <ul className="space-y-3 text-muted-foreground">
            <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>

          </ul>
        </div>

      </motion.div>
      <div className="border-t border-white/5">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">
          <p>© 2026 HASA GOLD STORE. ALL RIGHTS RESERVED.</p>
          <p className="flex items-center gap-2">
            DEVELOPED BY <a 
              href="https://wa.me/94775352074" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary font-bold hover:text-yellow-500 transition-colors cursor-pointer"
            >
              PATHUM DEV
            </a>
          </p>
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            SECURED BY 256-BIT SSL ENCRYPTION
          </p>
        </div>

      </div>
    </footer>
  );
};


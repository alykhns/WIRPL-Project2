import streamlit as st
import requests

API = "http://localhost:3000/api"

st.set_page_config(
    page_title="Lumiere Admin",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

html, body, [class*="css"] { font-family: 'DM Sans', sans-serif; }

[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
}
[data-testid="stSidebar"] * { color: #e8e8f0 !important; }
[data-testid="stSidebar"] button p { color: #1a1a2e !important; }
[data-testid="stSidebar"] button { background: white !important; }

.lumiere-header {
    background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #533483 100%);
    padding: 1.5rem 2rem;
    border-radius: 16px;
    margin-bottom: 1.5rem;
    color: white;
}
.lumiere-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    margin: 0;
    color: white !important;
}
.lumiere-header p {
    margin: 0.2rem 0 0;
    opacity: 0.9;
    font-size: 12px;
    color: rgba(255,255,255,0.85) !important;
}

.metric-card {
    background: white; border-radius: 12px; padding: 1.2rem 1.5rem;
    border: 1px solid #f0f0f5; box-shadow: 0 2px 8px rgba(0,0,0,0.04); text-align: center;
}
.metric-value { font-size: 2rem; font-weight: 600; color: #533483; }
.metric-label { font-size: 12px; color: #888; margin-top: 2px; }

.card {
    background: white; border-radius: 14px; padding: 1.2rem 1.5rem;
    border: 1px solid #f0f0f5; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    margin-bottom: 0.8rem;
}
.section-title {
    font-family: 'Playfair Display', serif; font-size: 1.5rem;
    color: #1a1a2e; margin-bottom: 1.2rem; padding-bottom: 0.5rem;
    border-bottom: 2px solid #f0eeff;
}
.badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge-green  { background: #eafaf1; color: #1e8449; }
.badge-orange { background: #fff3e0; color: #e65100; }
.badge-blue   { background: #eaf0ff; color: #2e5bce; }
.badge-red    { background: #fce4ec; color: #c62828; }
.badge-gray   { background: #f5f5f5; color: #555; }

.product-image {
    background: linear-gradient(135deg, #f0eeff, #e8f4ff);
    border-radius: 10px; height: 110px;
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; margin-bottom: 0.8rem;
}
</style>
""", unsafe_allow_html=True)

# ── Session state ──
for key, val in [("token", None), ("user", None), ("cart", [])]:
    if key not in st.session_state:
        st.session_state[key] = val

# ── Helper ──
def auth_header():
    return {"Authorization": f"Bearer {st.session_state.token}"}

def status_badge(status):
    mapping = {
        "order":    ("blue",   "ORDER"),
        "pay":      ("orange", "MENUNGGU BAYAR"),
        "paid":     ("green",  "DIBAYAR"),
        "delivery": ("blue",   "DIKIRIM"),
        "completed":("green",  "SELESAI"),
        "cancel":   ("red",    "DIBATALKAN"),
        "pending":  ("orange", "PENDING"),
        "success":  ("green",  "SUKSES"),
        "preparing":("gray",   "DISIAPKAN"),
        "picked_up":("blue",   "DIPICKUP"),
        "in_transit":("blue",  "DALAM PERJALANAN"),
        "delivered":("green",  "DITERIMA"),
    }
    color, label = mapping.get(status, ("gray", status.upper()))
    return f'<span class="badge badge-{color}">{label}</span>'

# ── Sidebar ──
with st.sidebar:
    st.markdown("## ✨ Lumiere")
    st.caption("Admin Dashboard")
    st.divider()

    if st.session_state.token:
        st.success(f"👤 {st.session_state.user.get('username', 'Admin')}")
        page = st.radio("Menu", [
            "🏠 Dashboard",
            "📦 Manajemen Produk",
            "📋 Manajemen Order",
            "💳 Manajemen Pembayaran",
            "🚚 Manajemen Pengiriman",
            "🏭 Supplier & Purchase Order",
            "🔍 Lacak Paket",
        ])
        st.divider()
        if st.button("🚪 Logout", use_container_width=True):
            st.session_state.token = None
            st.session_state.user = None
            st.rerun()
    else:
        page = "🔐 Login"

# ── Header ──
st.markdown("""
<div class="lumiere-header">
    <h1 style="color:white !important; font-size:2.5rem">✨ Lumière Admin</h1>
    <p style="color:rgba(255,255,255,0.8) !important; font-size:13px">
        Multisystem E-Commerce · Dashboard Administrator
    </p>
</div>
""", unsafe_allow_html=True)

# ══════════════════════════════════════
# LOGIN
# ══════════════════════════════════════
if not st.session_state.token:
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        tab_login, tab_register = st.tabs(["🔑 Login", "📝 Daftar"])

        with tab_login:
            email    = st.text_input("Email", placeholder="nama@email.com")
            password = st.text_input("Password", type="password")
            if st.button("Masuk →", use_container_width=True, type="primary"):
                try:
                    res = requests.post(f"{API}/auth/login", json={"email": email, "password": password})
                    if res.status_code == 200:
                        data = res.json()
                        st.session_state.token = data["token"]
                        st.session_state.user  = data["user"]
                        st.rerun()
                    else:
                        st.error(res.json().get("error", "Login gagal"))
                except:
                    st.error("❌ Tidak bisa konek ke server. Pastikan Node.js jalan!")

        with tab_register:
            r_username = st.text_input("Username")
            r_email    = st.text_input("Email", key="reg_email")
            r_password = st.text_input("Password", type="password", key="reg_pass")
            c1, c2     = st.columns(2)
            r_fname    = c1.text_input("Nama Depan")
            r_lname    = c2.text_input("Nama Belakang")
            if st.button("Daftar Sekarang", use_container_width=True, type="primary"):
                try:
                    res = requests.post(f"{API}/auth/register", json={
                        "username": r_username, "email": r_email,
                        "password": r_password, "first_name": r_fname, "last_name": r_lname
                    })
                    if res.status_code == 201:
                        st.success("✅ Berhasil! Silakan login.")
                    else:
                        st.error(res.json().get("error", "Gagal register"))
                except:
                    st.error("❌ Tidak bisa konek ke server.")

# ══════════════════════════════════════
# DASHBOARD
# ══════════════════════════════════════
elif page == "🏠 Dashboard":
    st.markdown('<div class="section-title">📊 Dashboard Overview</div>', unsafe_allow_html=True)

    try:
        products  = requests.get(f"{API}/products").json()
        orders    = requests.get(f"{API}/orders").json()
        couriers  = requests.get(f"{API}/logistics/couriers").json()
        methods   = requests.get(f"{API}/payment/methods").json()
        suppliers = requests.get(f"{API}/supplier").json()
    except:
        products, orders, couriers, methods, suppliers = [], [], [], [], []

    products  = products  if isinstance(products,  list) else []
    orders    = orders    if isinstance(orders,    list) else []
    couriers  = couriers  if isinstance(couriers,  list) else []
    methods   = methods   if isinstance(methods,   list) else []
    suppliers = suppliers if isinstance(suppliers, list) else []

    # Metrics
    c1, c2, c3, c4, c5 = st.columns(5)
    for col, val, label, icon in [
        (c1, len(products),  "Total Produk",   "📦"),
        (c2, len(orders),    "Total Orders",   "📋"),
        (c3, len(suppliers), "Supplier",       "🏭"),
        (c4, len(couriers),  "Kurir Aktif",    "🚚"),
        (c5, len(methods),   "Metode Bayar",   "💳"),
    ]:
        col.markdown(f"""
        <div class="metric-card">
            <div style="font-size:1.8rem">{icon}</div>
            <div class="metric-value">{val}</div>
            <div class="metric-label">{label}</div>
        </div>
        """, unsafe_allow_html=True)

    st.divider()

    col_left, col_right = st.columns(2)

    # Order terbaru
    with col_left:
        st.subheader("📋 Order Terbaru")
        for o in orders[:5]:
            st.markdown(f"""
            <div class="card">
                <b>Order #{o['order_id']}</b> &nbsp;
                {status_badge(o.get('order_status','order'))}
                <br><span style="color:#888;font-size:12px">
                Rp {float(o['total_amount']):,.0f} · Buyer #{o['buyer_id']}
                </span>
            </div>
            """, unsafe_allow_html=True)

    # Produk stok rendah
    with col_right:
        st.subheader("⚠️ Stok Produk Rendah")
        low_stock = [p for p in products if p.get("stock", 0) <= 10]
        if low_stock:
            for p in low_stock[:5]:
                st.markdown(f"""
                <div class="card">
                    <b>{p['product_name']}</b>
                    <span class="badge badge-orange" style="float:right">Stok: {p['stock']}</span>
                    <br><span style="color:#888;font-size:12px">Rp {float(p['price']):,.0f}</span>
                </div>
                """, unsafe_allow_html=True)
        else:
            st.info("✅ Semua stok produk aman.")

# ══════════════════════════════════════
# MANAJEMEN PRODUK
# ══════════════════════════════════════
elif page == "📦 Manajemen Produk":
    st.markdown('<div class="section-title">📦 Manajemen Produk</div>', unsafe_allow_html=True)

    tab_list, tab_add, tab_edit, tab_delete = st.tabs([
        "📋 Daftar Produk", "➕ Tambah Produk", "✏️ Edit Produk", "🗑️ Hapus Produk"
    ])

    try:
        products = requests.get(f"{API}/products").json()
        products = products if isinstance(products, list) else []
    except:
        products = []
        st.error("Gagal memuat produk")

    # LIST
    with tab_list:
        search = st.text_input("🔍 Cari produk...", placeholder="Ketik nama produk")
        sort   = st.selectbox("Urutkan", ["Terbaru", "Harga ↑", "Harga ↓", "Stok ↑", "Stok ↓"])

        filtered = products
        if search:
            filtered = [p for p in filtered if search.lower() in p["product_name"].lower()]
        if sort == "Harga ↑":   filtered = sorted(filtered, key=lambda x: float(x["price"]))
        elif sort == "Harga ↓": filtered = sorted(filtered, key=lambda x: float(x["price"]), reverse=True)
        elif sort == "Stok ↑":  filtered = sorted(filtered, key=lambda x: x["stock"])
        elif sort == "Stok ↓":  filtered = sorted(filtered, key=lambda x: x["stock"], reverse=True)

        st.caption(f"Menampilkan {len(filtered)} produk")

        emojis = ["👗","📱","🪑","💄","⚽","📚","👟","🎮","🧴","🎒","⌚","🖥️","💍","👜","🕶️"]
        cols = st.columns(3)
        for i, p in enumerate(filtered):
            with cols[i % 3]:
                stock_badge = (
                    '<span class="badge badge-green">Stok Aman</span>' if p["stock"] > 10
                    else '<span class="badge badge-orange">Stok Rendah</span>'
                )
                st.markdown(f"""
                <div class="card">
                    <div class="product-image">{emojis[i % len(emojis)]}</div>
                    <b>{p['product_name']}</b> &nbsp; {stock_badge}<br>
                    <span style="color:#533483;font-weight:600">Rp {float(p['price']):,.0f}</span><br>
                    <span style="color:#888;font-size:12px">Stok: {p['stock']} · ID: {p['product_id']}</span><br>
                    <span style="color:#aaa;font-size:11px">{(p.get('description') or '')[:60]}</span>
                </div>
                """, unsafe_allow_html=True)
                st.markdown("<br>", unsafe_allow_html=True)

    # TAMBAH
    with tab_add:
        st.subheader("➕ Tambah Produk Baru")
        with st.form("form_add_product"):
            name  = st.text_input("Nama Produk *")
            desc  = st.text_area("Deskripsi")
            col_p, col_s = st.columns(2)
            price = col_p.number_input("Harga (Rp) *", min_value=0.0, step=1000.0)
            stock = col_s.number_input("Stok *", min_value=0, step=1)
            submitted = st.form_submit_button("➕ Tambah Produk", type="primary", use_container_width=True)

        if submitted:
            if not name:
                st.error("Nama produk wajib diisi.")
            else:
                try:
                    res = requests.post(f"{API}/products",
                        json={"product_name": name, "description": desc, "price": price, "stock": stock},
                        headers=auth_header())
                    if res.status_code in [200, 201]:
                        st.success(f"✅ Produk '{name}' berhasil ditambahkan!")
                        st.toast(f"✅ Produk '{name}' berhasil ditambahkan!", icon="📦")
                        st.rerun()
                    else:
                        st.error(f"Gagal: {res.json()}")
                except Exception as e:
                    st.error(f"Error: {e}")

    # EDIT
    with tab_edit:
        st.subheader("✏️ Edit Produk")
        if products:
            product_map = {f"[#{p['product_id']}] {p['product_name']}": p for p in products}
            selected    = st.selectbox("Pilih produk yang ingin diedit", list(product_map.keys()))
            p           = product_map[selected]

            with st.form("form_edit_product"):
                new_name  = st.text_input("Nama Produk", value=p["product_name"])
                new_desc  = st.text_area("Deskripsi",    value=p.get("description", ""))
                col_p, col_s = st.columns(2)
                new_price = col_p.number_input("Harga (Rp)", value=float(p["price"]), step=1000.0)
                new_stock = col_s.number_input("Stok",       value=int(p["stock"]),   step=1)
                submitted = st.form_submit_button("💾 Simpan Perubahan", type="primary", use_container_width=True)

            if submitted:
                try:
                    res = requests.put(f"{API}/products/{p['product_id']}",
                        json={"product_name": new_name, "description": new_desc,
                              "price": new_price, "stock": new_stock},
                        headers=auth_header())
                    if res.status_code == 200:
                        st.success(f"✅ Produk '{new_name}' berhasil diupdate!")
                        st.toast(f"✅ Produk berhasil diupdate!", icon="✏️")
                        st.rerun()
                    else:
                        st.error(f"Gagal: {res.json()}")
                except Exception as e:
                    st.error(f"Error: {e}")
        else:
            st.info("Tidak ada produk tersedia.")

    # HAPUS
    with tab_delete:
        st.subheader("🗑️ Hapus Produk")
        st.warning("⚠️ Tindakan ini tidak dapat dibatalkan!")
        if products:
            product_map = {f"[#{p['product_id']}] {p['product_name']}": p for p in products}
            selected    = st.selectbox("Pilih produk yang ingin dihapus", list(product_map.keys()), key="del_select")
            p           = product_map[selected]
            st.markdown(f"""
            <div class="card">
                <b>{p['product_name']}</b><br>
                <span style="color:#533483">Rp {float(p['price']):,.0f}</span> &nbsp;·&nbsp;
                <span style="color:#888">Stok: {p['stock']}</span>
            </div>
            """, unsafe_allow_html=True)
            konfirmasi = st.checkbox(f"Saya yakin ingin menghapus produk ini")
            if st.button("🗑️ Hapus Produk", type="primary", disabled=not konfirmasi):
                try:
                    res = requests.delete(f"{API}/products/{p['product_id']}", headers=auth_header())
                    if res.status_code == 200:
                        st.success("✅ Produk berhasil dihapus!")
                        st.toast("🗑️ Produk berhasil dihapus!", icon="🗑️")
                        st.rerun()
                    else:
                        st.error(f"Gagal: {res.json()}")
                except Exception as e:
                    st.error(f"Error: {e}")

# ══════════════════════════════════════
# MANAJEMEN ORDER
# ══════════════════════════════════════
elif page == "📋 Manajemen Order":
    st.markdown('<div class="section-title">📋 Manajemen Order</div>', unsafe_allow_html=True)

    if "order_notif" in st.session_state and st.session_state["order_notif"]:
        st.success(st.session_state["order_notif"])
        st.session_state["order_notif"] = ""

    tab_list_order, tab_buat_order = st.tabs(["📋 Daftar Order", "➕ Buat Order"])

    # ── DAFTAR ORDER ──
    with tab_list_order:
        try:
            orders = requests.get(f"{API}/orders").json()
            orders = orders if isinstance(orders, list) else []
        except:
            orders = []
            st.error("Gagal memuat orders")

        all_statuses  = ["Semua"] + list({o.get("order_status","order") for o in orders})
        filter_status = st.selectbox("Filter Status", all_statuses)
        st.caption(f"Total: {len(orders)} order")

        filtered = orders if filter_status == "Semua" else [o for o in orders if o.get("order_status") == filter_status]

        for o in filtered:
            with st.expander(f"📋 Order #{o['order_id']}  —  Rp {float(o['total_amount']):,.0f}"):
                st.markdown(f"""
                <div class="card">
                    <b>Order #{o['order_id']}</b> &nbsp; {status_badge(o.get('order_status','order'))}<br>
                    <span style="color:#888;font-size:13px">
                        Buyer ID: {o['buyer_id']} &nbsp;·&nbsp;
                        Total: Rp {float(o['total_amount']):,.0f} &nbsp;·&nbsp;
                        {o.get('created_at','')[:10]}
                    </span>
                </div>
                """, unsafe_allow_html=True)

                try:
                    detail = requests.get(f"{API}/orders/{o['order_id']}").json()
                    dcol1, dcol2 = st.columns(2)
                    with dcol1:
                        st.markdown("**💳 Payment**")
                        pay = detail.get("payment")
                        if pay:
                            st.markdown(f"{status_badge(pay.get('status','pending'))}", unsafe_allow_html=True)
                            st.write(f"Jumlah: Rp {float(pay.get('amount',0)):,.0f}")
                            st.write(f"Metode: {pay.get('method_name','—')} ({pay.get('provider','—')})")
                        else:
                            st.caption("Belum ada data payment")
                    with dcol2:
                        st.markdown("**🚚 Pengiriman**")
                        ship = detail.get("shipment")
                        if ship:
                            st.markdown(f"{status_badge(ship.get('shipping_status','preparing'))}", unsafe_allow_html=True)
                            st.write(f"Kurir: {ship.get('courier_name','—')} — {ship.get('service_type','—')}")
                            st.write(f"Resi: `{ship.get('tracking_number','—')}`")
                        else:
                            st.caption("Belum ada data pengiriman")
                except:
                    st.caption("Gagal memuat detail order")

    # ── BUAT ORDER ──
    with tab_buat_order:
        st.subheader("➕ Buat Order Baru (Admin)")
        st.info("Fitur ini memungkinkan admin membuat order manual — misalnya untuk order via telepon atau walk-in.")

        try:
            products = requests.get(f"{API}/products").json()
            products = products if isinstance(products, list) else []
            methods  = requests.get(f"{API}/payment/methods").json()
            methods  = methods  if isinstance(methods,  list) else []
            couriers = requests.get(f"{API}/logistics/couriers").json()
            couriers = couriers if isinstance(couriers, list) else []
        except:
            products, methods, couriers = [], [], []
            st.error("Gagal memuat data. Pastikan semua service berjalan.")

        if products and methods and couriers:
            product_map = {f"[#{p['product_id']}] {p['product_name']} — Rp {float(p['price']):,.0f}": p for p in products}
            method_map  = {f"{m['provider']} ({m['method_name']})": m for m in methods}
            courier_map = {f"{c['courier_name']} — {c['service_type']} (Rp {float(c['cost_per_km']):,.0f}/km)": c for c in couriers}

            with st.form("form_buat_order"):
                st.markdown("**👤 Info Pembeli**")
                col_b, col_i = st.columns(2)
                buyer_id      = col_b.number_input("Buyer ID", min_value=1, step=1, value=1)
                institution_id = col_i.number_input("Institution ID", min_value=1, step=1, value=1)

                st.markdown("**📦 Produk**")
                sel_product = st.selectbox("Pilih Produk", list(product_map.keys()))
                col_q, col_p = st.columns(2)
                quantity = col_q.number_input("Jumlah", min_value=1, step=1, value=1)
                p_obj    = product_map[sel_product]
                price    = col_p.number_input("Harga Satuan (Rp)", min_value=0.0,
                                               value=float(p_obj["price"]), step=1000.0)
                total    = quantity * price
                st.markdown(f"💰 **Total: Rp {total:,.0f}**")

                st.markdown("**🚚 Pengiriman**")
                address     = st.text_input("Alamat Pengiriman", placeholder="Jl. Kaliurang, Sleman, DI Yogyakarta")
                sel_courier = st.selectbox("Pilih Kurir", list(courier_map.keys()))

                st.markdown("**💳 Pembayaran**")
                sel_method = st.selectbox("Pilih Metode Pembayaran", list(method_map.keys()))

                submitted = st.form_submit_button("📋 Buat Order", type="primary", use_container_width=True)

            if submitted:
                if not address.strip():
                    st.error("Alamat pengiriman wajib diisi.")
                else:
                    try:
                        res = requests.post(f"{API}/orders/checkout", json={
                            "buyer_id":            int(buyer_id),
                            "institution_id":      int(institution_id),
                            "total_amount":        total,
                            "items":               [{"product_id": p_obj["product_id"],
                                                     "quantity": int(quantity),
                                                     "price": price}],
                            "payment_method_id":   method_map[sel_method]["method_id"],
                            "courier_id":          courier_map[sel_courier]["courier_id"],
                            "destination_address": address,
                        })
                        if res.status_code in [200, 201]:
                            data = res.json()
                            st.session_state["order_notif"] = f"✅ Order #{data.get('order_id')} berhasil dibuat! Nomor resi: {data.get('tracking_number')}"
                            st.rerun()
                        else:
                            st.error(f"Gagal membuat order: {res.json()}")
                    except Exception as e:
                        st.error(f"Error: {e}")

# ══════════════════════════════════════
# MANAJEMEN PEMBAYARAN
# ══════════════════════════════════════
elif page == "💳 Manajemen Pembayaran":
    st.markdown('<div class="section-title">💳 Manajemen Pembayaran</div>', unsafe_allow_html=True)

    tab_check, tab_confirm, tab_methods = st.tabs([
        "🔍 Cek Status Pembayaran", "✅ Konfirmasi Pembayaran", "📋 Metode Pembayaran"
    ])

    with tab_check:
        st.subheader("🔍 Cek Status Pembayaran by Order ID")
        st.caption("Data payment diambil dari detail order. Gunakan Order ID yang dibuat lewat checkout.")
        order_id_input = st.number_input("Masukkan Order ID", min_value=1, step=1)
        if st.button("🔍 Cek Pembayaran", type="primary"):
            try:
                res = requests.get(f"{API}/orders/{int(order_id_input)}")
                if res.status_code == 200:
                    data = res.json()
                    pay  = data.get("payment")
                    if pay:
                        st.markdown(f"""
                        <div class="card">
                            <b>Transaction #{pay['transaction_id']}</b> &nbsp;
                            {status_badge(pay.get('status','pending'))}<br>
                            <span style="color:#533483;font-weight:600;font-size:1.1rem">
                                Rp {float(pay['amount']):,.0f}
                            </span><br>
                            <span style="color:#888;font-size:13px">
                                Order ID: #{pay['order_id']} &nbsp;·&nbsp;
                                Metode: {pay.get('provider','—')} ({pay.get('method_name','—')})
                            </span><br>
                            <span style="color:#aaa;font-size:12px">
                                Dibayar: {pay.get('paid_at') or 'Belum dibayar'}
                            </span>
                        </div>
                        """, unsafe_allow_html=True)
                        if pay.get("status") == "pending":
                            st.info("ℹ️ Pembayaran masih pending. Gunakan tab Konfirmasi untuk mengkonfirmasi.")
                            st.session_state["pending_transaction_id"] = pay["transaction_id"]
                        else:
                            st.success("✅ Pembayaran sudah dikonfirmasi.")

                        # Tampilkan juga info shipment
                        ship = data.get("shipment")
                        if ship:
                            st.markdown(f"""
                            <div class="card">
                                <b>🚚 Info Pengiriman</b> &nbsp;
                                {status_badge(ship.get('shipping_status','preparing'))}<br>
                                <span style="color:#888;font-size:13px">
                                    Resi: <code>{ship.get('tracking_number','—')}</code><br>
                                    Kurir: {ship.get('courier_name','—')} — {ship.get('service_type','—')}<br>
                                    Tujuan: {ship.get('destination_address','—')}
                                </span>
                            </div>
                            """, unsafe_allow_html=True)
                    else:
                        st.warning("⚠️ Order ini belum memiliki data payment. Pastikan order dibuat lewat proses checkout.")
                else:
                    st.error("❌ Order tidak ditemukan.")
            except Exception as e:
                st.error(f"Error: {e}")

    with tab_confirm:
        st.subheader("✅ Konfirmasi Pembayaran")
        st.info("Masukkan Transaction ID untuk mengkonfirmasi pembayaran. Transaction ID bisa didapat dari tab Cek Status.")

        transaction_id = st.number_input("Transaction ID", min_value=1, step=1,
            value=st.session_state.get("pending_transaction_id", 1))
        external_ref = st.text_input("External Reference (opsional)",
            placeholder=f"Contoh: OVO-TRX-{transaction_id}")

        if st.button("✅ Konfirmasi Pembayaran", type="primary", use_container_width=True):
            try:
                ref = external_ref or f"MANUAL-CONFIRM-{transaction_id}"
                res = requests.put(f"{API}/payment/{int(transaction_id)}/confirm",
                    json={"external_ref": ref})
                if res.status_code == 200:
                    data = res.json()
                    st.success("✅ Pembayaran berhasil dikonfirmasi!")
                    pay = data.get("payment", {})
                    st.markdown(f"""
                    <div class="card">
                        <b>Transaction #{pay.get('transaction_id','—')}</b> &nbsp;
                        {status_badge(pay.get('status','success'))}<br>
                        <span style="color:#533483;font-weight:600">
                            Rp {float(pay.get('amount',0)):,.0f}
                        </span><br>
                        <span style="color:#888;font-size:13px">
                            Order ID: #{pay.get('order_id','—')} &nbsp;·&nbsp;
                            Ref: {pay.get('external_ref','—')}
                        </span>
                    </div>
                    """, unsafe_allow_html=True)
                else:
                    st.error(f"Gagal: {res.json()}")
            except Exception as e:
                st.error(f"Error: {e}")

    with tab_methods:
        st.subheader("📋 Daftar Metode Pembayaran")
        try:
            methods = requests.get(f"{API}/payment/methods").json()
            methods = methods if isinstance(methods, list) else []
            cols = st.columns(3)
            icons = {"OVO": "💜", "GoPay": "💚", "BCA": "🔵", "Mandiri": "🟡", "Cash on Delivery": "💵"}
            for i, m in enumerate(methods):
                with cols[i % 3]:
                    icon = icons.get(m["provider"], "💳")
                    active_badge = '<span class="badge badge-green">Aktif</span>' if m.get("is_active") else '<span class="badge badge-red">Nonaktif</span>'
                    st.markdown(f"""
                    <div class="card" style="text-align:center">
                        <div style="font-size:2rem">{icon}</div>
                        <b>{m['provider']}</b> &nbsp; {active_badge}<br>
                        <span style="color:#888;font-size:12px">{m['method_name']}</span>
                    </div>
                    """, unsafe_allow_html=True)
                    st.markdown("<br>", unsafe_allow_html=True)
        except:
            st.error("Gagal memuat metode pembayaran")

# ══════════════════════════════════════
# MANAJEMEN PENGIRIMAN
# ══════════════════════════════════════
elif page == "🚚 Manajemen Pengiriman":
    st.markdown('<div class="section-title">🚚 Manajemen Pengiriman</div>', unsafe_allow_html=True)

    tab_update, tab_couriers = st.tabs(["📍 Update Status Pengiriman", "🚚 Daftar Kurir"])

    with tab_update:
        st.subheader("📍 Update Status Pengiriman")
        st.info("Masukkan Order ID untuk mengupdate status pengiriman paket.")

        col1, col2 = st.columns(2)
        order_id_ship = col1.number_input("Order ID", min_value=1, step=1)
        new_status    = col2.selectbox("Status Baru", [
            "preparing", "picked_up", "in_transit", "delivered", "returned"
        ], format_func=lambda x: {
            "preparing":  "📦 Sedang Disiapkan",
            "picked_up":  "🚗 Dipickup Kurir",
            "in_transit": "🚚 Dalam Perjalanan",
            "delivered":  "✅ Telah Diterima",
            "returned":   "↩️ Dikembalikan",
        }[x])

        location = st.text_input("Lokasi Saat Ini", placeholder="Contoh: Hub Yogyakarta")
        note     = st.text_area("Catatan", placeholder="Contoh: Paket sedang dalam perjalanan ke alamat tujuan", height=80)

        if st.button("📍 Update Status", type="primary", use_container_width=True):
            if not location:
                st.error("Lokasi wajib diisi.")
            else:
                try:
                    res = requests.put(f"{API}/logistics/shipments/{int(order_id_ship)}/status",
                        json={"status": new_status, "location": location, "note": note})
                    if res.status_code == 200:
                        st.success(f"✅ Status pengiriman Order #{order_id_ship} berhasil diupdate ke '{new_status}'!")
                        st.balloons()
                    else:
                        st.error(f"Gagal: {res.json()}")
                except Exception as e:
                    st.error(f"Error: {e}")

        st.divider()

        # Cek tracking setelah update
        st.subheader("🔍 Verifikasi Tracking")
        resi_verify = st.text_input("Masukkan Nomor Resi untuk verifikasi", placeholder="LMR-XXXXXXXXXXXX")
        if st.button("🔍 Cek Tracking"):
            try:
                res = requests.get(f"{API}/logistics/track/{resi_verify}")
                if res.status_code == 200:
                    data = res.json()
                    ship = data["shipment"]
                    st.markdown(f"""
                    <div class="card">
                        <b>📦 {ship['tracking_number']}</b> &nbsp;
                        {status_badge(ship['shipping_status'])}<br>
                        <span style="color:#888;font-size:13px">
                            {ship['courier_name']} — {ship['service_type']}<br>
                            Tujuan: {ship['destination_address']}
                        </span>
                    </div>
                    """, unsafe_allow_html=True)
                    if data["history"]:
                        st.markdown("**📍 Riwayat Perjalanan:**")
                        for h in data["history"]:
                            st.markdown(f"- **{h.get('recorded_at','')[:16]}** — {h['location']}: _{h['status_note']}_")
                else:
                    st.error("❌ Nomor resi tidak ditemukan.")
            except Exception as e:
                st.error(f"Error: {e}")

    with tab_couriers:
        st.subheader("🚚 Daftar Kurir")
        try:
            couriers = requests.get(f"{API}/logistics/couriers").json()
            couriers = couriers if isinstance(couriers, list) else []
            cols = st.columns(2)
            courier_icons = {"JNE": "🟠", "SiCepat": "🔴", "J&T": "🔵", "AnterAja": "🟢"}
            for i, c in enumerate(couriers):
                icon = courier_icons.get(c["courier_name"], "🚚")
                with cols[i % 2]:
                    active_badge = '<span class="badge badge-green">Aktif</span>' if c.get("is_active") else '<span class="badge badge-red">Nonaktif</span>'
                    st.markdown(f"""
                    <div class="card">
                        <span style="font-size:1.5rem">{icon}</span> &nbsp;
                        <b>{c['courier_name']}</b> &nbsp; {active_badge}<br>
                        <span style="color:#533483;font-size:13px">{c['service_type']}</span><br>
                        <span style="color:#888;font-size:12px">
                            Biaya: Rp {float(c['cost_per_km']):,.0f}/km
                        </span>
                    </div>
                    """, unsafe_allow_html=True)
                    st.markdown("<br>", unsafe_allow_html=True)
        except:
            st.error("Gagal memuat data kurir")

# ══════════════════════════════════════
# SUPPLIER & PURCHASE ORDER
# ══════════════════════════════════════
elif page == "🏭 Supplier & Purchase Order":
    st.markdown('<div class="section-title">🏭 Supplier & Purchase Order</div>', unsafe_allow_html=True)

    tab_supplier, tab_po_list, tab_po_create = st.tabs([
        "🏭 Daftar Supplier", "📋 Purchase Orders", "➕ Buat Purchase Order"
    ])

    with tab_supplier:
        st.subheader("🏭 Daftar Supplier")
        try:
            suppliers = requests.get(f"{API}/supplier").json()
            suppliers = suppliers if isinstance(suppliers, list) else []
            cols = st.columns(2)
            for i, s in enumerate(suppliers):
                active_badge = '<span class="badge badge-green">Aktif</span>' if s.get("is_active") else '<span class="badge badge-red">Nonaktif</span>'
                with cols[i % 2]:
                    st.markdown(f"""
                    <div class="card">
                        <b>🏭 {s['supplier_name']}</b> &nbsp; {active_badge}<br>
                        <span class="badge badge-blue">{s.get('category','—')}</span><br>
                        <span style="color:#888;font-size:12px">
                            📧 {s.get('contact_email','—')}<br>
                            📞 {s.get('contact_phone','—')}
                        </span>
                    </div>
                    """, unsafe_allow_html=True)
                    st.markdown("<br>", unsafe_allow_html=True)
        except:
            st.error("Gagal memuat data supplier")

    with tab_po_list:
        st.subheader("📋 Daftar Purchase Order")
        try:
            po_list = requests.get(f"{API}/supplier/purchase-orders/list").json()
            po_list = po_list if isinstance(po_list, list) else []
            if po_list:
                for po in po_list:
                    st.markdown(f"""
                    <div class="card">
                        <b>PO #{po['po_id']}</b> &nbsp;
                        <span class="badge badge-blue">{po.get('status','draft').upper()}</span><br>
                        <span style="color:#533483;font-weight:600">
                            Rp {float(po['total_amount']):,.0f}
                        </span><br>
                        <span style="color:#888;font-size:12px">
                            Supplier: {po.get('supplier_name','—')}
                        </span>
                    </div>
                    """, unsafe_allow_html=True)
            else:
                st.info("Belum ada purchase order.")
        except:
            st.error("Gagal memuat purchase orders")

    with tab_po_create:
        st.subheader("➕ Buat Purchase Order Baru")
        try:
            suppliers = requests.get(f"{API}/supplier").json()
            suppliers = suppliers if isinstance(suppliers, list) else []
        except:
            suppliers = []

        if not suppliers:
            st.error("Tidak ada supplier tersedia.")
        else:
            supplier_map = {s["supplier_name"]: s["supplier_id"] for s in suppliers}
            sel_supplier = st.selectbox("Pilih Supplier", list(supplier_map.keys()))
            exp_delivery = st.date_input("Estimasi Pengiriman")
            notes        = st.text_area("Catatan", placeholder="Contoh: Restock produk katalog")

            st.subheader("Item Pesanan")
            col_pid, col_qty, col_price = st.columns(3)
            product_ref_id = col_pid.number_input("Product Ref ID", min_value=1, step=1)
            quantity       = col_qty.number_input("Jumlah", min_value=1, step=1)
            unit_price     = col_price.number_input("Harga Satuan (Rp)", min_value=0.0, step=1000.0)

            st.info(f"💰 Total: Rp {float(quantity * unit_price):,.0f}")

            if st.button("📋 Buat Purchase Order", type="primary", use_container_width=True):
                try:
                    res = requests.post(f"{API}/supplier/purchase-order", json={
                        "supplier_id":       supplier_map[sel_supplier],
                        "expected_delivery": str(exp_delivery),
                        "notes":             notes,
                        "items": [{
                            "product_ref_id": int(product_ref_id),
                            "quantity":       int(quantity),
                            "unit_price":     float(unit_price),
                        }]
                    })
                    if res.status_code in [200, 201]:
                        data = res.json()
                        st.success(f"✅ Purchase Order berhasil dibuat!")
                        st.info(f"PO ID: #{data.get('po_id','—')} · Total: Rp {float(data.get('total_amount',0)):,.0f}")
                    else:
                        st.error(f"Gagal: {res.json()}")
                except Exception as e:
                    st.error(f"Error: {e}")

# ══════════════════════════════════════
# LACAK PAKET
# ══════════════════════════════════════
elif page == "🔍 Lacak Paket":
    st.markdown('<div class="section-title">🔍 Lacak Paket</div>', unsafe_allow_html=True)

    col1, col2 = st.columns([3, 1])
    tracking_no = col1.text_input("Nomor Resi", placeholder="LMR-XXXXXXXXXXXX")
    if col2.button("🔍 Lacak", use_container_width=True, type="primary"):
        if tracking_no:
            try:
                res = requests.get(f"{API}/logistics/track/{tracking_no}")
                if res.status_code == 200:
                    data = res.json()
                    ship = data["shipment"]
                    st.markdown(f"""
                    <div class="card">
                        <b style="font-size:1.1rem">📦 {ship['tracking_number']}</b> &nbsp;
                        {status_badge(ship['shipping_status'])}<br>
                        <span style="color:#533483">
                            🚚 {ship['courier_name']} — {ship['service_type']}
                        </span><br>
                        <span style="color:#888;font-size:13px">
                            Order #{ship['order_id']} &nbsp;·&nbsp;
                            Tujuan: {ship['destination_address']}
                        </span>
                    </div>
                    """, unsafe_allow_html=True)

                    st.subheader("📍 Riwayat Perjalanan")
                    if data["history"]:
                        for h in data["history"]:
                            col_time, col_detail = st.columns([1, 3])
                            col_time.caption(h.get("recorded_at", "")[:16])
                            col_detail.markdown(f"**{h['location']}** — {h['status_note']}")
                    else:
                        st.caption("Belum ada riwayat tracking.")
                else:
                    st.error("❌ Nomor resi tidak ditemukan.")
            except Exception as e:
                st.error(f"Error: {e}")
        else:
            st.warning("Masukkan nomor resi terlebih dahulu.")
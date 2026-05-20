"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import {
  DEMO_GALLERY_ITEMS,
  loadGalleryUploads,
  saveGalleryUploads,
  type GalleryItem,
  type GalleryTab,
} from "@/features/gallery/demoGallery";
import { useI18n } from "@/i18n/useI18n";

import styles from "./gallery.module.css";

export default function GalleryPage() {
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<GalleryTab>("shop");
  const [uploads, setUploads] = useState<GalleryItem[]>([]);
  const [preview, setPreview] = useState<GalleryItem | null>(null);

  useEffect(() => {
    setUploads(loadGalleryUploads());
  }, []);

  const items = useMemo(() => {
    const all = [...uploads, ...DEMO_GALLERY_ITEMS];
    return all.filter((i) => i.tab === tab);
  }, [tab, uploads]);

  const onUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    const item: GalleryItem = {
      id: `up-${Date.now()}`,
      title: file.name.replace(/\.[^.]+$/, ""),
      garmentTag: "CUSTOM",
      clientLabel: "Uploaded",
      dateLabel: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      imageUrl: url,
      tab,
    };
    const next = [item, ...uploads];
    setUploads(next);
    saveGalleryUploads(next);
  };

  return (
    <div className={`${styles.page} stitch-page-pattern`}>
      <div className={styles.inner}>
        <header className={styles.heroHeader}>
          <div>
            <h1 className={styles.title}>{t("gallery.title")}</h1>
            <p className={styles.subtitle}>{t("gallery.subtitle")}</p>
          </div>
          <div className={styles.tabs} role="tablist" aria-label={t("gallery.title")}>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "shop"}
              className={`${styles.tab} ${tab === "shop" ? styles.tabActive : ""}`}
              onClick={() => setTab("shop")}
            >
              {t("gallery.shopTab")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "customer"}
              className={`${styles.tab} ${tab === "customer" ? styles.tabActive : ""}`}
              onClick={() => setTab("customer")}
            >
              {t("gallery.customerTab")}
            </button>
          </div>
        </header>

        <div className={styles.actionBar}>
          <div className={styles.actionGroup}>
            <button type="button" className={styles.secondaryBtn}>
              <MaterialIcon name="filter_list" size={18} />
              {t("gallery.filter")}
            </button>
            <button type="button" className={styles.secondaryBtn}>
              <MaterialIcon name="sort" size={18} />
              {t("gallery.sortNewest")}
            </button>
          </div>
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => fileRef.current?.click()}
          >
            <MaterialIcon name="add_photo_alternate" size={20} />
            {t("gallery.upload")}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              e.target.value = "";
            }}
          />
        </div>

        {items.length === 0 ? (
          <p className={styles.empty}>{t("gallery.empty")}</p>
        ) : (
          <ul className={styles.grid}>
            {items.map((item) => (
              <li key={item.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.title} className={styles.image} />
                  <div className={styles.hover}>
                    <div className={styles.hoverActions}>
                      <button
                        type="button"
                        className={styles.iconCircle}
                        onClick={() => setPreview(item)}
                        aria-label="Preview"
                      >
                        <MaterialIcon name="visibility" size={18} />
                      </button>
                      <button
                        type="button"
                        className={styles.iconCircle}
                        onClick={() => setPreview(item)}
                        aria-label="Edit"
                      >
                        <MaterialIcon name="edit" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <span className={styles.tag}>{item.garmentTag}</span>
                  </div>
                  <p className={styles.cardMeta}>{item.clientLabel}</p>
                  <p className={styles.cardDate}>{item.dateLabel}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {preview ? (
          <div
            className={styles.modal}
            role="dialog"
            aria-modal
            onClick={() => setPreview(null)}
          >
            <div className={styles.modalInner} onClick={(e) => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.imageUrl} alt={preview.title} className={styles.modalImg} />
              <p className={styles.modalTitle}>{preview.title}</p>
              <button type="button" className={styles.closeBtn} onClick={() => setPreview(null)}>
                {t("common.back")}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

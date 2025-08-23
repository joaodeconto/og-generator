"use client";

import { ChangeEvent, DragEvent } from 'react';
import { useEditorStore } from 'lib/editorStore';

/**
 * Form controls for editing the Open Graph image properties. Each input is
 * connected to a state setter in the global editor store. Feel free to
 * extend this component with additional controls as new features are added.
 */
export default function EditorControls() {
  const {
    title,
    subtitle,
    theme,
    layout,
    bannerUrl,
    logoPosition,
    logoScale,
    invertLogo,
    removeLogoBg,
    logoUrl,
    maskLogo,
    setTitle,
    setSubtitle,
    setTheme,
    setLayout,
    setBannerUrl,
    setLogoFile,
    setLogoUrl,
    setLogoPosition,
    setLogoScale,
    toggleInvertLogo,
    toggleRemoveLogoBg,
    toggleMaskLogo
  } = useEditorStore();

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setBannerUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setBannerUrl(url);
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setLogoFile(undefined);
      return;
    }
    setLogoFile(file);
  };

  const handleBannerUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setBannerUrl(url || undefined);
  };

  const handleLogoUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setLogoUrl(url || undefined);
  };

  const handleBannerDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerUrl(url);
    }
  };

  const handleLogoDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="title">
          Título
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Digite o título"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="subtitle">
          Subtítulo
        </label>
        <input
          id="subtitle"
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Digite o subtítulo"
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700" htmlFor="theme">
            Tema
          </label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700" htmlFor="layout">
            Layout
          </label>
          <select
            id="layout"
            value={layout}
            onChange={(e) => setLayout(e.target.value as 'left' | 'center')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="left">Texto à esquerda</option>
            <option value="center">Texto centralizado</option>
          </select>
        </div>
      </div>
      <div onDragOver={(e) => e.preventDefault()} onDrop={handleBannerDrop}>
        <label className="block text-sm font-medium text-gray-700" htmlFor="banner">
          Banner (opcional)
        </label>
        <input
          id="banner"
          type="file"
          accept="image/*"
          onChange={handleBannerChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
        />
        <input
          type="url"
          placeholder="URL do banner"
          value={bannerUrl || ''}
          onChange={handleBannerUrlChange}
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div onDragOver={(e) => e.preventDefault()} onDrop={handleLogoDrop}>
        <label className="block text-sm font-medium text-gray-700" htmlFor="logo">
          Logo (upload ou URL)
        </label>
        <input
          id="logo"
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
        />
        <input
          type="url"
          placeholder="URL do logo"
          value={logoUrl || ''}
          onChange={handleLogoUrlChange}
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700" htmlFor="logo-x">
            Logo X (%)
          </label>
          <input
            id="logo-x"
            type="range"
            min="0"
            max="100"
            step="1"
            value={logoPosition.x}
            onChange={(e) => setLogoPosition(parseFloat(e.target.value), logoPosition.y)}
            className="mt-1 w-full"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700" htmlFor="logo-y">
            Logo Y (%)
          </label>
          <input
            id="logo-y"
            type="range"
            min="0"
            max="100"
            step="1"
            value={logoPosition.y}
            onChange={(e) => setLogoPosition(logoPosition.x, parseFloat(e.target.value))}
            className="mt-1 w-full"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="logo-scale">
          Escala do Logo
        </label>
        <input
          id="logo-scale"
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={logoScale}
          onChange={(e) => setLogoScale(parseFloat(e.target.value))}
          className="mt-1 w-full"
        />
      </div>
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={invertLogo}
            onChange={toggleInvertLogo}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span>Inverter cores do logo</span>
        </label>
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={removeLogoBg}
            onChange={toggleRemoveLogoBg}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span>Remover fundo do logo</span>
        </label>
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={maskLogo}
            onChange={toggleMaskLogo}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span>Máscara circular</span>
        </label>
      </div>
    </div>
  );
}
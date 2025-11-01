# 🥷 scNinja - Sistema de Gestión de Ninjas

Sistema full-stack para gestionar ninjas, misiones y combates inspirado en Naruto.

**Stack:** Spring Boot + React + MySQL + Docker

---

## ⚡ Inicio Rápido

### Requisitos
- Docker Desktop instalado
- Puertos 3000, 8080 y 3306 disponibles

### Instalación y Ejecución
```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/scninja.git
cd scninja

# 2. Levantar servicios
docker-compose up -d

# 3. Acceder a la aplicación
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
```

**¡Listo!** La aplicación debería estar corriendo en 2-3 minutos.

---

## 🎮 Funcionalidades

- ✅ Crear ninjas (Factory o Builder pattern)
- ✅ Asignar y completar misiones
- ✅ Entrenar ninjas para mejorar stats
- ✅ Simular combates entre ninjas
- ✅ Sistema de progresión de rangos (Genin → Chunin → Jonin → Kage)

---

## 📖 Uso Básico

### 1. Crear un Ninja

**Opción A - Factory (rápido):**
- Ve a "Crear Ninja (Factory)"
- Ingresa nombre y selecciona aldea
- Click en "Crear Ninja"

**Opción B - Builder (personalizado):**
- Ve a "Crear Ninja (Builder)"
- Configura stats y selecciona jutsus
- Click en "Crear Ninja Personalizado"

### 2. Crear Misiones de Prueba
```bash
# Misión Rango D (para Genin)
curl -X POST http://localhost:8080/api/misiones \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Buscar gato perdido","rango":"D","recompensa":50}'

# Misión Rango C (para Genin/Chunin)
curl -X POST http://localhost:8080/api/misiones \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Escoltar mercader","rango":"C","recompensa":150}'

# Misión Rango B (para Chunin/Jonin)
curl -X POST http://localhost:8080/api/misiones \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Eliminar renegados","rango":"B","recompensa":500}'
```

### 3. Aceptar Misiones
- Selecciona un ninja y una misión compatible con su rango
- El ninja gana dinero al completarla

### 4. Entrenar Ninjas
- Selecciona ninja, atributo (ataque/defensa/chakra), coste y mejora
- El ninja sube de rango automáticamente al alcanzar umbrales

### 5. Combates
- Selecciona dos ninjas y sus jutsus
- El ganador recibe bonificación (+5 ataque, +2 chakra)

---

## 🔧 Comandos Útiles
```bash
# Ver logs
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Detener todo
docker-compose down

# Limpiar y reconstruir (si algo falla)
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## 🐛 Problemas Comunes

### Frontend no carga / Página en blanco
```bash
docker-compose down -v
docker-compose build --no-cache frontend
docker-compose up -d
```

### Backend no conecta a MySQL
```bash
docker-compose down -v
docker-compose up -d
# Espera 30 segundos para que MySQL inicialice
```

### Puerto ocupado
```bash
# Ver qué está usando el puerto
lsof -i :3000
lsof -i :8080

# Matar proceso
kill -9 <PID>
```

---

## 📊 Rangos de Ninjas

| Rango | Misiones Permitidas | Requisitos para Ascender |
|-------|---------------------|--------------------------|
| Genin | D, C | ATK≥100, DEF≥100, CHA≥100 |
| Chunin | D, C, B | ATK≥200, DEF≥200, CHA≥200 |
| Jonin | D, C, B, A | ATK≥300, DEF≥300, CHA≥300 |
| Kage | Todas (D-S) | - |

---

## 🏗️ Arquitectura
```
Frontend (React + Nginx) :3000
         ↓ HTTP
Backend (Spring Boot) :8080
         ↓ JPA
Database (MySQL) :3306
```

**Patrones implementados:**
- Factory Pattern (creación de ninjas por aldea)
- Builder Pattern (creación personalizada)
- Repository Pattern (acceso a datos)

---

## 📂 Estructura Simplificada
```
scninja/
├── docker-compose.yml          # Configuración Docker
├── src/                        # Backend Spring Boot
│   └── main/java/.../
│       ├── controller/         # REST Controllers
│       ├── service/            # Lógica de negocio
│       ├── repository/         # Acceso a datos
│       ├── model/              # Entidades JPA
│       ├── factory/            # Factory Pattern
│       └── builder/            # Builder Pattern
└── frontend/                   # Frontend React
    ├── src/components/         # Componentes UI
    └── src/services/           # Servicios API
```

---

## 🔌 API Endpoints Principales
```
GET    /api/ninjas                              # Listar ninjas
POST   /api/ninjas/factory                      # Crear con Factory
POST   /api/ninjas/builder                      # Crear con Builder
POST   /api/ninjas/{id}/aceptar/{misionId}      # Aceptar misión
POST   /api/ninjas/{id}/entrenar                # Entrenar
POST   /api/ninjas/combate                      # Combate

GET    /api/misiones                            # Listar misiones
POST   /api/misiones                            # Crear misión
```

---

## 👥 Autores

- **[Tu Nombre]** - Desarrollo Full Stack

---

## 📄 Licencia

Proyecto educativo - Fines académicos

---

<div align="center">
  <strong>🥷 Spring Boot + React + Docker 🥷</strong>
</div>
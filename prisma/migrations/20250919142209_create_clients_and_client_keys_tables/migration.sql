-- CreateTable
CREATE TABLE "public"."clients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."client_keys" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "client_id" INTEGER NOT NULL,

    CONSTRAINT "client_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_name_key" ON "public"."clients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "client_keys_key_key" ON "public"."client_keys"("key");

-- CreateIndex
CREATE UNIQUE INDEX "client_keys_client_id_key" ON "public"."client_keys"("client_id");

-- AddForeignKey
ALTER TABLE "public"."client_keys" ADD CONSTRAINT "client_keys_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

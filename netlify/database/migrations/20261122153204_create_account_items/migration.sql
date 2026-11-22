CREATE TABLE "account_items" (
	"user_id" text,
	"kind" text,
	"id" text,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "account_items_pkey" PRIMARY KEY("user_id","kind","id")
);

"use client";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function MobilePublicOffer() {
  const locale = useLocale();

  return (
    <div className="w-full px-[11px] mt-[24px] flex flex-col items-center md:hidden">
      <Link
        href={"/"}
        className="text-blue-600 text-[15px] font-roboto mb-4 self-start"
      >
        {locale === "ru" ? "← Назад на главную" : "← Back to home"}
      </Link>
      <h1 className="text-[16px] text-gray-800 font-unbounded font-bold mb-4 text-center">
        {locale === "ru" ? "ПУБЛИЧНАЯ ОФЕРТА" : "PUBLIC OFFER"}
      </h1>

      <div className="text-[13px] text-left text-gray-700 mt-[12px] font-roboto max-w-none space-y-4">
        {/* Преамбула */}
        <div className="pb-4 border-b border-gray-200">
          <p className="leading-relaxed">
            {locale === "ru"
              ? "Настоящая Публичная оферта является официальным предложением DMME HK LIMITED (регистрационный номер 77196171, Гонконг) и ИП Асланян Давид Арменович (ИНН 250822605454, Россия) заключить договор купли-продажи цифровых (виртуальных) товаров с любым физическим лицом (Покупателем) на условиях, изложенных ниже."
              : "This Public Offer is an official proposal by DMME HK LIMITED (registration number 77196171, Hong Kong) and IP Aslanyan David Armenovich (INN 250822605454, Russia) to enter into a purchase and sale agreement for digital (virtual) goods with any individual (Buyer) under the terms set forth below."}
          </p>
          <p className="leading-relaxed mt-3">
            {locale === "ru"
              ? "Оферта является публичной и действует до её отзыва. Размещение настоящего документа на сайте https://don-vip.com считается официальным предложением Продавцов в соответствии с Гражданским кодексом Российской Федерации (ст. 437) и законодательством Гонконга (Contract Law / Sale of Goods Ordinance, Cap. 26)."
              : "The offer is public and valid until its revocation. Posting this document on https://don-vip.com is considered an official proposal by the Sellers in accordance with the Civil Code of the Russian Federation (Art. 437) and Hong Kong legislation (Contract Law / Sale of Goods Ordinance, Cap. 26)."}
          </p>
        </div>

        {/* Section 1 - Общие положения */}
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-[15px] font-bold text-gray-800 mb-3 flex items-center">
            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-[11px] font-bold mr-2">
              1
            </span>
            {locale === "ru"
              ? "ОБЩИЕ ПОЛОЖЕНИЯ И ОСНОВНЫЕ ТЕРМИНЫ"
              : "GENERAL PROVISIONS AND BASIC TERMS"}
          </h2>

          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-gray-800 mb-2 text-[14px]">
                {locale === "ru" ? "1.1. Продавцы:" : "1.1. Sellers:"}
              </h3>
              <div className="bg-blue-50 p-3 rounded-lg mb-3">
                <p className="text-[12px] text-gray-700 mb-1">
                  <strong>DMME HK LIMITED</strong>,{" "}
                  {locale === "ru"
                    ? "зарегистрированная в соответствии с законодательством Гонконга,"
                    : "registered in accordance with Hong Kong law,"}
                </p>
                <p className="text-[12px] text-gray-700 mb-1">
                  {locale === "ru"
                    ? "регистрационный номер"
                    : "registration number"}{" "}
                  <strong>77196171</strong>,
                </p>
                <p className="text-[12px] text-gray-700 mb-1">
                  {locale === "ru" ? "юридический адрес:" : "legal address:"}{" "}
                  8/F., China Hong Kong Tower, 8–12 Hennessy Road, Wan Chai,
                  Hong Kong,
                </p>
                <p className="text-[12px] text-gray-700">
                  e-mail: support@don-vip.com.
                </p>
              </div>
            </div>

            <p className="text-[12px]">
              <strong>1.2.</strong>{" "}
              {locale === "ru"
                ? "Интернет-магазин — сайт https://don-vip.com, через который осуществляется продажа цифровых товаров (внутриигровая валюта, виртуальные предметы и иные цифровые продукты), а также информирование покупателей об условиях приобретения, оплате и доставке."
                : "Online store — the website https://don-vip.com, through which digital goods are sold (in-game currency, virtual items and other digital products), as well as informing buyers about purchase conditions, payment and delivery."}
            </p>

            <p className="text-[12px]">
              <strong>1.3.</strong>{" "}
              {locale === "ru"
                ? "Сайт доступен круглосуточно. Обработка заказов осуществляется ежедневно с 09:00 до 21:00 по местному времени (GMT+4 для РФ / GMT+8 для Гонконга)."
                : "The site is available 24/7. Order processing is carried out daily from 09:00 to 21:00 local time (GMT+4 for RF / GMT+8 for Hong Kong)."}
            </p>

            <p className="text-[12px]">
              <strong>1.4.</strong>{" "}
              {locale === "ru"
                ? "Покупатель — любое физическое лицо, оформившее заказ и оплатившее цифровой товар на Сайте."
                : "Buyer — any individual who has placed an order and paid for a digital product on the Site."}
            </p>

            <p className="text-[12px]">
              <strong>1.5.</strong>{" "}
              {locale === "ru"
                ? "Оферта — публичное предложение Продавцов любому лицу заключить договор купли-продажи цифровых товаров (далее — «Договор») на условиях, изложенных ниже."
                : 'Offer — a public proposal by the Sellers to any person to conclude a purchase and sale agreement for digital goods (hereinafter — "Agreement") on the terms set forth below.'}
            </p>

            <p className="text-[12px]">
              <strong>1.6.</strong>{" "}
              {locale === "ru"
                ? "Акцепт — полное и безоговорочное принятие условий Оферты Покупателем, выраженное в оформлении и оплате заказа."
                : "Acceptance — full and unconditional acceptance of the Offer terms by the Buyer, expressed in placing and paying for an order."}
            </p>

            <p className="text-[12px]">
              <strong>1.7.</strong>{" "}
              {locale === "ru"
                ? "Дата вступления в силу — момент публикации настоящей Оферты на Сайте. Продавцы вправе изменять условия без предварительного уведомления. Все изменения вступают в силу с момента публикации на Сайте."
                : "Effective date — the moment of publication of this Offer on the Site. Sellers have the right to change terms without prior notice. All changes take effect from the moment of publication on the Site."}
            </p>
          </div>
        </div>

        {/* Section 2 - Предмет договора */}
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-[15px] font-bold text-gray-800 mb-3 flex items-center">
            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-[11px] font-bold mr-2">
              2
            </span>
            {locale === "ru" ? "ПРЕДМЕТ ДОГОВОРА" : "SUBJECT OF THE AGREEMENT"}
          </h2>

          <div className="space-y-3">
            <p className="text-[12px]">
              <strong>2.1.</strong>{" "}
              {locale === "ru"
                ? "Продавцы обязуются предоставить Покупателю цифровой товар (внутриигровую валюту, виртуальные предметы или иные цифровые услуги), а Покупатель обязуется оплатить и принять указанный товар в соответствии с условиями настоящей Оферты."
                : "Sellers undertake to provide the Buyer with digital goods (in-game currency, virtual items or other digital services), and the Buyer undertakes to pay for and accept the specified goods in accordance with the terms of this Offer."}
            </p>

            <p className="text-[12px]">
              <strong>2.2.</strong>{" "}
              {locale === "ru"
                ? "Все цифровые товары поставляются в электронном виде и предназначены для использования на игровых или цифровых платформах."
                : "All digital goods are delivered electronically and are intended for use on gaming or digital platforms."}
            </p>

            <p className="text-[12px]">
              <strong>2.3.</strong>{" "}
              {locale === "ru"
                ? "В зависимости от страны Покупателя и способа оплаты исполнителем по договору может являться одно из двух юридических лиц, указанных в п. 1.1."
                : "Depending on the Buyer's country and payment method, one of the two legal entities specified in clause 1.1 may be the executor under the agreement."}
            </p>
          </div>
        </div>

        {/* Section 3 - Оформление заказа */}
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-[15px] font-bold text-gray-800 mb-3 flex items-center">
            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-[11px] font-bold mr-2">
              3
            </span>
            {locale === "ru"
              ? "ОФОРМЛЕНИЕ ЗАКАЗА И ЗАКЛЮЧЕНИЕ ДОГОВОРА"
              : "ORDER PLACEMENT AND AGREEMENT CONCLUSION"}
          </h2>

          <div className="space-y-3">
            <p className="text-[12px]">
              <strong>3.1.</strong>{" "}
              {locale === "ru"
                ? "Акцепт Оферты признаётся совершённым в момент оформления и оплаты заказа Покупателем. С этого момента Договор считается заключённым."
                : "Acceptance of the Offer is considered complete at the moment the Buyer places and pays for the order. From this moment, the Agreement is considered concluded."}
            </p>

            <p className="text-[12px]">
              <strong>3.2.</strong>{" "}
              {locale === "ru"
                ? "Покупатель оформляет заказ на сайте https://don-vip.com, указывая имя, адрес электронной почты и необходимые данные для доставки цифрового товара (ID игрового аккаунта или иные идентификаторы)."
                : "The Buyer places an order on the website https://don-vip.com, specifying name, email address and necessary data for digital goods delivery (game account ID or other identifiers)."}
            </p>

            <p className="text-[12px]">
              <strong>3.3.</strong>{" "}
              {locale === "ru"
                ? "Заказ считается оформленным с момента поступления оплаты Продавцу."
                : "The order is considered placed from the moment payment is received by the Seller."}
            </p>

            <div>
              <p className="text-[12px] mb-2">
                <strong>3.4.</strong>{" "}
                {locale === "ru"
                  ? "Оформляя заказ, Покупатель подтверждает, что:"
                  : "By placing an order, the Buyer confirms that:"}
              </p>
              <ul className="space-y-1 list-none pl-3">
                <li className="flex items-start">
                  <span className="text-green-500 font-bold mr-2 text-[10px] mt-0.5">
                    ✓
                  </span>
                  <span className="text-[12px]">
                    {locale === "ru"
                      ? "является дееспособным лицом;"
                      : "is a legally capable person;"}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 font-bold mr-2 text-[10px] mt-0.5">
                    ✓
                  </span>
                  <span className="text-[12px]">
                    {locale === "ru"
                      ? "ознакомлен с условиями Оферты и принимает их;"
                      : "is familiar with the Offer terms and accepts them;"}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 font-bold mr-2 text-[10px] mt-0.5">
                    ✓
                  </span>
                  <span className="text-[12px]">
                    {locale === "ru"
                      ? "предоставляет достоверные данные;"
                      : "provides accurate data;"}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 font-bold mr-2 text-[10px] mt-0.5">
                    ✓
                  </span>
                  <span className="text-[12px]">
                    {locale === "ru"
                      ? "соглашается на обработку персональных данных для целей исполнения договора, уведомлений и информационной рассылки."
                      : "agrees to the processing of personal data for the purposes of contract execution, notifications and informational mailings."}
                  </span>
                </li>
              </ul>
            </div>

            <p className="text-[12px]">
              <strong>3.5.</strong>{" "}
              {locale === "ru"
                ? "Покупатель вправе отозвать согласие на обработку персональных данных, направив письменное уведомление по адресу соответствующего Продавца."
                : "The Buyer has the right to withdraw consent for personal data processing by sending a written notice to the address of the relevant Seller."}
            </p>
          </div>
        </div>

        {/* Section 4 - Стоимость и оплата */}
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-[15px] font-bold text-gray-800 mb-3 flex items-center">
            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-[11px] font-bold mr-2">
              4
            </span>
            {locale === "ru" ? "СТОИМОСТЬ И ОПЛАТА" : "COST AND PAYMENT"}
          </h2>

          <div className="space-y-3">
            <p className="text-[12px]">
              <strong>4.1.</strong>{" "}
              {locale === "ru"
                ? "Цена товара устанавливается Продавцом и указана на сайте. Продавец вправе изменять цены без предварительного уведомления."
                : "The price of goods is set by the Seller and indicated on the website. The Seller has the right to change prices without prior notice."}
            </p>

            <div>
              <p className="text-[12px] mb-2">
                <strong>4.2.</strong>{" "}
                {locale === "ru"
                  ? "Оплата осуществляется в безналичной форме через платёжных партнёров."
                  : "Payment is made in non-cash form through payment partners."}
              </p>
            </div>

            <p className="text-[12px]">
              <strong>4.3.</strong>{" "}
              {locale === "ru"
                ? "Обязательство Покупателя по оплате считается исполненным в момент зачисления денежных средств на счёт Продавца или его платёжного агента."
                : "The Buyer's payment obligation is considered fulfilled at the moment funds are credited to the Seller's account or payment agent."}
            </p>

            <p className="text-[12px]">
              <strong>4.4.</strong>{" "}
              {locale === "ru"
                ? "Право на использование цифрового контента (лицензия) передаётся Покупателю после полной оплаты."
                : "The right to use digital content (license) is transferred to the Buyer after full payment."}
            </p>

            <p className="text-[12px]">
              <strong>4.5.</strong>{" "}
              {locale === "ru"
                ? "После оплаты Покупатель получает электронное подтверждение (чек, квитанцию или электронное уведомление)."
                : "After payment, the Buyer receives electronic confirmation (receipt, voucher or electronic notification)."}
            </p>

            <div>
              <p className="text-[12px] mb-2">
                <strong>4.6.</strong>{" "}
                {locale === "ru" ? "Порядок расчётов:" : "Payment procedure:"}
              </p>
              <p className="text-[12px] ml-2">
                {locale === "ru"
                  ? "Платежи принимаются в зависимости от региона покупателя следующим образом:"
                  : "Payments are accepted depending on the buyer's region as follows:"}
              </p>
              <ul className="list-disc ml-4 mt-2 space-y-2">
                <li className="text-[12px]">
                  {locale === "ru"
                    ? "Покупатели, осуществляющие оплату из Российской Федерации и стран СНГ, проводят оплату через уполномоченного платёжного партнёра, действующего на основании соответствующих договорных отношений с DMME HK LIMITED."
                    : "Buyers making payments from the Russian Federation and CIS countries make payments through an authorized payment partner acting on the basis of relevant contractual relationships with DMME HK LIMITED."}
                </li>
                <li className="text-[12px]">
                  {locale === "ru"
                    ? "Покупатели из других стран осуществляют оплату напрямую в пользу DMME HK LIMITED, зарегистрированной в соответствии с законодательством Гонконга (регистрационный номер: 77196171)."
                    : "Buyers from other countries make payments directly in favor of DMME HK LIMITED, registered in accordance with Hong Kong law (registration number: 77196171)."}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 5 - Возврат и отмена */}
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-[15px] font-bold text-gray-800 mb-3 flex items-center">
            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-[11px] font-bold mr-2">
              5
            </span>
            {locale === "ru"
              ? "ВОЗВРАТ, ОТМЕНА И ИЗМЕНЕНИЕ ЗАКАЗА"
              : "RETURN, CANCELLATION AND ORDER CHANGES"}
          </h2>

          <div className="space-y-3">
            <p className="text-[12px]">
              <strong>5.1.</strong>{" "}
              {locale === "ru"
                ? "Возврат денежных средств возможен только при наличии технической ошибки со стороны Продавца (например, двойного списания или неверного зачисления товара)."
                : "Refunds are possible only in case of a technical error on the Seller's side (for example, double charging or incorrect crediting of goods)."}
            </p>

            <p className="text-[12px]">
              <strong>5.2.</strong>{" "}
              {locale === "ru"
                ? "Изменение заказа допускается только по согласованию с Продавцом до момента его исполнения."
                : "Order changes are allowed only by agreement with the Seller before its execution."}
            </p>

            <p className="text-[12px]">
              <strong>5.3.</strong>{" "}
              {locale === "ru"
                ? "Цифровые товары, доставленные на аккаунт Покупателя, возврату и обмену не подлежат."
                : "Digital goods delivered to the Buyer's account are not subject to return or exchange."}
            </p>

            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-red-800 text-[12px]">
                <strong>5.4.</strong>{" "}
                {locale === "ru"
                  ? "Продавец не несёт ответственности за неверно указанные данные Покупателем (включая игровые ID, ники, e-mail или иные идентификаторы), а также за случаи, когда заказанный цифровой товар в автоматическом режиме был доставлен на неправильный аккаунт вследствие ошибки Покупателя при вводе данных."
                  : "The Seller is not responsible for incorrectly specified data by the Buyer (including game IDs, nicknames, e-mail or other identifiers), as well as for cases when the ordered digital goods were automatically delivered to the wrong account due to the Buyer's error when entering data."}
              </p>
            </div>

            <p className="text-[12px]">
              <strong>5.5.</strong>{" "}
              {locale === "ru"
                ? "Покупатель обязуется тщательно проверять корректность указанных данных перед оплатой. В случае ошибки ответственность за возможные убытки полностью возлагается на Покупателя."
                : "The Buyer undertakes to carefully check the correctness of the specified data before payment. In case of error, responsibility for possible losses is entirely borne by the Buyer."}
            </p>
          </div>
        </div>

        {/* Section 6 - Применимое право */}
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-[15px] font-bold text-gray-800 mb-3 flex items-center">
            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-[11px] font-bold mr-2">
              6
            </span>
            {locale === "ru"
              ? "ПРАВО, ПРИМЕНИМОЕ ЗАКОНОДАТЕЛЬСТВО И РАЗРЕШЕНИЕ СПОРОВ"
              : "APPLICABLE LAW, LEGISLATION AND DISPUTE RESOLUTION"}
          </h2>

          <div className="space-y-3">
            <p className="text-[12px]">
              <strong>6.1.</strong>{" "}
              {locale === "ru"
                ? "Для покупателей из Российской Федерации и стран СНГ отношения регулируются законодательством Российской Федерации."
                : "For buyers from the Russian Federation and CIS countries, relations are governed by the legislation of the Russian Federation."}
            </p>

            <p className="text-[12px]">
              <strong>6.2.</strong>{" "}
              {locale === "ru"
                ? "Для покупателей из других стран — законодательством Гонконга (Hong Kong Law), включая Sale of Goods Ordinance (Cap. 26) и Electronic Transactions Ordinance (Cap. 553)."
                : "For buyers from other countries — Hong Kong Law, including Sale of Goods Ordinance (Cap. 26) and Electronic Transactions Ordinance (Cap. 553)."}
            </p>

            <p className="text-[12px]">
              <strong>6.3.</strong>{" "}
              {locale === "ru"
                ? "Все споры и разногласия разрешаются путём переговоров, а при недостижении соглашения — в компетентном суде в зависимости от применимого законодательства."
                : "All disputes and disagreements are resolved through negotiations, and if no agreement is reached — in a competent court depending on applicable legislation."}
            </p>

            <p className="text-[12px]">
              <strong>6.4.</strong>{" "}
              {locale === "ru"
                ? "В случае расхождений между русской и английской версиями Оферты приоритет имеет английская версия."
                : "In case of discrepancies between the Russian and English versions of the Offer, the English version takes priority."}
            </p>
          </div>
        </div>

        {/* Section 7 - Реквизиты */}
        <div className="pb-4">
          <h2 className="text-[15px] font-bold text-gray-800 mb-3 flex items-center">
            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-[11px] font-bold mr-2">
              7
            </span>
            {locale === "ru" ? "РЕКВИЗИТЫ ПРОДАВЦОВ" : "SELLERS' DETAILS"}
          </h2>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2 text-[13px]">
                DMME HK LIMITED
              </h3>
              <div className="space-y-1 text-[11px] text-gray-700">
                <p>
                  <strong>Registration No.:</strong> 77196171
                </p>
                <p>
                  <strong>{locale === "ru" ? "Адрес" : "Address"}:</strong>{" "}
                  8/F., China Hong Kong Tower, 8–12 Hennessy Road, Wan Chai,
                  Hong Kong
                </p>
                <p>
                  <strong>E-mail:</strong>{" "}
                  <a
                    href="mailto:support@don-vip.com"
                    className="text-blue-600 hover:underline"
                  >
                    support@don-vip.com
                  </a>
                </p>
                <p>
                  <strong>{locale === "ru" ? "Веб-сайт" : "Website"}:</strong>{" "}
                  <a
                    href="https://don-vip.com"
                    className="text-blue-600 hover:underline"
                  >
                    https://don-vip.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
